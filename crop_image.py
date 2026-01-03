from PIL import Image
import os

input_path = "assets/matt_architect.png"
output_path = "assets/matt_architect.png"  # Overwrite

def process_image():
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    print(f"Opening {input_path}...")
    img = Image.open(input_path)
    width, height = img.size
    print(f"Current size: {width}x{height}")
    
    # Make the image 40% smaller (keep 60%)
    scale = 0.60
    new_width = int(width * scale)
    new_height = int(height * scale)
    
    resized = img.resize((new_width, new_height), Image.LANCZOS)
    print(f"After resize (60%): {new_width}x{new_height}")
    
    resized.save(output_path)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    process_image()
