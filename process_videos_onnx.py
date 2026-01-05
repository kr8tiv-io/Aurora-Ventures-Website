import os
import onnxruntime as ort
import numpy as np
import cv2
from moviepy import VideoFileClip, ImageSequenceClip

# Configuration
ASSETS_DIR = "./assets"
TARGET_FILES = ["code.mp4"]
MODEL_PATH = "u2netp.onnx"

def preprocess(frame):
    """Preprocess frame for U2Net (320x320, normalized)"""
    img = cv2.resize(frame, (320, 320))
    img = img.astype(np.float32) / 255.0
    img = img.transpose((2, 0, 1))
    img = np.expand_dims(img, axis=0)
    return img

def postprocess(mask, original_shape):
    """Postprocess mask from U2Net output"""
    mask = mask.squeeze()
    mask = (mask * 255).astype(np.uint8)
    mask = cv2.resize(mask, (original_shape[1], original_shape[0]))
    return mask

def process_video(filename):
    input_path = os.path.join(ASSETS_DIR, filename)
    output_filename = filename.replace(".mp4", "_transparent.webm")
    output_path = os.path.join(ASSETS_DIR, output_filename)

    if not os.path.exists(input_path):
        print(f"⚠️  Skipping {filename}: File not found")
        return

    print(f"🔮 Processing {filename} with U2Net (Agency Quality + Solid Fill)...")

    session = ort.InferenceSession(MODEL_PATH)
    input_name = session.get_inputs()[0].name

    clip = VideoFileClip(input_path)
    processed_frames = []

    total_frames = int(clip.fps * clip.duration)
    
    for i, frame in enumerate(clip.iter_frames()):
        if i % 10 == 0: print(f"   Frame {i}/{total_frames}")
        
        original_shape = frame.shape
        
        # 1. Predict Mask
        input_tensor = preprocess(frame)
        outputs = session.run(None, {input_name: input_tensor})
        mask_pred = outputs[0]
        
        # 2. Refine Mask
        alpha = postprocess(mask_pred, original_shape)
        # Close small gaps/holes along edges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=2)
        
        # 3. Post-processing: Fill holes (Solidify the square/subject)
        contours, _ = cv2.findContours(alpha.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            # Find largest contour (the main subject)
            largest_contour = max(contours, key=cv2.contourArea)
            # Fill it with solid white (255) to prevent internal transparency
            cv2.drawContours(alpha, [largest_contour], -1, 255, thickness=cv2.FILLED)
        
        # 4. Create RGBA
        r, g, b = cv2.split(frame)
        rgba = cv2.merge((r, g, b, alpha))
        processed_frames.append(rgba)

    print(f"   Encoding {output_filename}...")
    final_clip = ImageSequenceClip(processed_frames, fps=clip.fps)
    final_clip.write_videofile(
        output_path, 
        codec="libvpx", 
        audio=False, 
        preset="ultrafast", 
        bitrate="5000k",
        logger=None
    )
    
    print(f"✅ Finished: {output_filename}")
    clip.close()
    final_clip.close()

if __name__ == "__main__":
    if not os.path.exists(MODEL_PATH):
        print(f"Error: {MODEL_PATH} not found.")
    else:
        print("--- STARTING HIGH-QUALITY BG REMOVAL ---")
        for video in TARGET_FILES:
            try:
                process_video(video)
            except Exception as e:
                print(f"❌ Error: {e}")
