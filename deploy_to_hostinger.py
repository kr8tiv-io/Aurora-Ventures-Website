import urllib.request
import urllib.error
import json
import math
import os
import sys
from pathlib import Path

TOKEN    = os.environ["HOSTINGER_TOKEN"]
USERNAME = "u637913108"
DOMAIN   = "auroraventures.agency"
BASE     = "https://developers.hostinger.com"
ARCHIVE  = Path("aurora_site_deploy.zip")
CHUNK    = 10 * 1024 * 1024


def api_post(path, body=None, extra=None):
    url = BASE + path
    data = json.dumps(body).encode() if body else b""
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Authorization", "Bearer " + TOKEN)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json")
    if extra:
        for k, v in extra.items():
            req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            print("  HTTP " + str(r.status) + " body_len=" + str(len(raw)))
            return r.status, json.loads(raw.decode()) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read()
        print("  HTTPError " + str(e.code) + " body=" + str(raw[:200]))
        try:
            return e.code, json.loads(raw.decode())
        except Exception:
            return e.code, {"message": raw.decode("utf-8", errors="replace")[:200]}
    except Exception as ex:
        print("  Exception: " + str(ex))
        return None, {"message": str(ex)}


# Stage 1: Get upload credentials
print("Stage 1: Get upload credentials")
st, resp = api_post(
    "/api/hosting/v1/files/upload-urls",
    {"username": USERNAME, "domain": DOMAIN}
)
print("  Status: " + str(st))
print("  Response: " + str(resp)[:300])
if st not in (200, 201):
    print("FAILED Stage 1: " + str(resp))
    sys.exit(1)

upload_url = resp.get("url", "")
auth_key   = resp.get("auth_key", "")
rest_key   = resp.get("rest_auth_key", "")
if not upload_url:
    print("FAILED: no upload_url in response")
    sys.exit(1)
print("  Upload URL: " + upload_url[:60])

# Stage 2: TUS upload
print("Stage 2: TUS upload")
data = ARCHIVE.read_bytes()
total = len(data)
print("  File: " + ARCHIVE.name + " (" + str(total) + " bytes)")
tus_url = upload_url.rstrip("/") + "/" + ARCHIVE.name + "?override=true"
print("  TUS URL: " + tus_url[:80])

req2 = urllib.request.Request(tus_url, data=b"", method="POST")
req2.add_header("X-Auth",         auth_key)
req2.add_header("X-Auth-Rest",    rest_key)
req2.add_header("Upload-Length",  str(total))
req2.add_header("Tus-Resumable",  "1.0.0")
req2.add_header("Content-Type",   "application/offset+octet-stream")
req2.add_header("Content-Length", "0")
try:
    with urllib.request.urlopen(req2, timeout=30) as r:
        tus_loc = r.headers.get("Location") or ""
    print("  TUS POST OK, location: " + tus_loc[:80])
except urllib.error.HTTPError as e:
    raw = e.read()
    print("  TUS POST failed " + str(e.code) + ": " + str(raw[:200]))
    sys.exit(1)

parts = upload_url.split("/")
host_base = parts[0] + "//" + parts[2]
patch_base = tus_loc if tus_loc.startswith("http") else host_base + tus_loc
n_chunks = math.ceil(total / CHUNK)
print("  Uploading " + str(n_chunks) + " chunk(s)")
for i in range(n_chunks):
    offset = i * CHUNK
    chunk = data[offset: offset + CHUNK]
    req3 = urllib.request.Request(patch_base, data=chunk, method="PATCH")
    req3.add_header("X-Auth",         auth_key)
    req3.add_header("X-Auth-Rest",    rest_key)
    req3.add_header("Tus-Resumable",  "1.0.0")
    req3.add_header("Upload-Offset",  str(offset))
    req3.add_header("Content-Type",   "application/offset+octet-stream")
    req3.add_header("Content-Length", str(len(chunk)))
    with urllib.request.urlopen(req3, timeout=180) as r:
        ps = r.status
    print("  Chunk " + str(i + 1) + "/" + str(n_chunks) + ": offset=" + str(offset) + " status=" + str(ps))
    if ps not in (200, 204):
        print("  FAILED chunk " + str(i + 1))
        sys.exit(1)
print("  Upload complete!")

# Stage 3: Trigger deploy
print("Stage 3: Trigger deploy")
st3, resp3 = api_post(
    "/api/hosting/v1/accounts/" + USERNAME + "/websites/" + DOMAIN + "/deploy",
    {"archive_path": ARCHIVE.name}
)
print("  Status: " + str(st3))
print("  Response: " + str(resp3))
if st3 not in (200, 201, 202, 204):
    print("FAILED Stage 3")
    sys.exit(1)
print("SUCCESS!")
