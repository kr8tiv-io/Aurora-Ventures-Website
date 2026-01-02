import os
import cv2
import numpy as np
from moviepy import VideoFileClip, ImageSequenceClip

# Configuration
INPUT_PATH = "./assets/code.mp4"
OUTPUT_PATH = "./assets/code_keyed.webm"
WHITE_THRESHOLD = 240  # Pixels brighter than this become transparent

def process_video():
    print(f"🎬 Processing {INPUT_PATH}...")
    clip = VideoFileClip(INPUT_PATH)
    processed_frames = []
    total_frames = int(clip.fps * clip.duration)

    for i, frame in enumerate(clip.iter_frames()):
        if i % 20 == 0:
            print(f"   Frame {i}/{total_frames}")

        # Frame is HxWx3 (RGB)
        h, w = frame.shape[:2]
        
        # Create alpha channel
        # Pure white (R>240 AND G>240 AND B>240) becomes transparent
        gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
        
        # Threshold: pixels above 240 brightness = background (transparent)
        _, mask_bg = cv2.threshold(gray, WHITE_THRESHOLD, 255, cv2.THRESH_BINARY)
        
        # Invert: now foreground (cube) is white, background is black
        mask_fg = cv2.bitwise_not(mask_bg)
        
        # Smooth edges slightly
        mask_fg = cv2.GaussianBlur(mask_fg, (3, 3), 0)
        
        # Combine RGB + Alpha
        r, g, b = cv2.split(frame)
        rgba = cv2.merge((r, g, b, mask_fg))
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
