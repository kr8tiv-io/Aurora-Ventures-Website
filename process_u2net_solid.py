import os
import cv2
import numpy as np
import onnxruntime as ort
from moviepy import VideoFileClip, ImageSequenceClip

# Configuration
INPUT_PATH = "./assets/code.mp4"
OUTPUT_PATH = "./assets/code_solid.webm"
MODEL_PATH = "u2net.onnx"
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "u2netp.onnx"

def norm_pred(d):
    ma = np.max(d)
    mi = np.min(d)
    return (d - mi) / (ma - mi + 1e-8)

def preprocess(image):
    img = image / 255.0
    img = cv2.resize(img, (320, 320))
    tmpImg = np.zeros((320, 320, 3))
    tmpImg[:, :, 0] = (img[:, :, 0] - 0.485) / 0.229
    tmpImg[:, :, 1] = (img[:, :, 1] - 0.456) / 0.224
    tmpImg[:, :, 2] = (img[:, :, 2] - 0.406) / 0.225
    tmpImg = tmpImg.transpose((2, 0, 1))
    tmpImg = np.expand_dims(tmpImg, 0)
    return tmpImg.astype(np.float32)

def process_video():
    print(f"🔮 Loading ONNX Model: {MODEL_PATH}...")
    session = ort.InferenceSession(MODEL_PATH)

    print(f"🎬 Processing {INPUT_PATH} with U2Net + Solid Fill...")
    clip = VideoFileClip(INPUT_PATH)
    processed_frames = []
    total_frames = int(clip.fps * clip.duration)

    for i, frame in enumerate(clip.iter_frames()):
        if i % 20 == 0:
            print(f"   Frame {i}/{total_frames}")

        h, w = frame.shape[:2]

        # 1. U2Net Inference
        img_pre = preprocess(frame)
        inputs = {session.get_inputs()[0].name: img_pre}
        ort_outs = session.run(None, inputs)
        
        pred = ort_outs[0][0, 0, :, :]
        pred = norm_pred(pred)
        mask_u2net = cv2.resize(pred, (w, h))
        
        # 2. Threshold and binarize
        mask_u2net = (mask_u2net * 255).astype(np.uint8)
        _, mask_binary = cv2.threshold(mask_u2net, 127, 255, cv2.THRESH_BINARY)
        
        # 3. Find the largest contour (the cube)
        contours, _ = cv2.findContours(mask_binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        final_alpha = np.zeros((h, w), dtype=np.uint8)
        
        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            
            # Get convex hull to fill any concave gaps
            hull = cv2.convexHull(largest_contour)
            
            # Draw it SOLID - this preserves the cube interior
            cv2.drawContours(final_alpha, [hull], -1, 255, thickness=cv2.FILLED)
            
            # Smooth edges slightly
            final_alpha = cv2.GaussianBlur(final_alpha, (5, 5), 0)

        # 4. Combine RGB + Alpha
        r, g, b = cv2.split(frame)
        rgba = cv2.merge((r, g, b, final_alpha))
        processed_frames.append(rgba)

    print(f"   Encoding {OUTPUT_PATH}...")
    final_clip = ImageSequenceClip(processed_frames, fps=clip.fps)
    final_clip.write_videofile(
        OUTPUT_PATH,
        codec="libvpx",
        audio=False,
        preset="ultrafast",
        bitrate="5000k",
        logger=None
    )
    
    print(f"✅ Finished: {OUTPUT_PATH}")
    clip.close()
    final_clip.close()

if __name__ == "__main__":
    process_video()
