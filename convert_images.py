import os
from PIL import Image
from pathlib import Path

def convert_to_webp(directory):
    count = 0
    saved_space = 0
    
    print(f"Scanning {directory}...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = Path(root) / file
                webp_path = file_path.with_suffix('.webp')
                
                # Skip if webp already exists
                if webp_path.exists():
                    continue
                    
                try:
                    with Image.open(file_path) as img:
                        # Save as WebP
                        img.save(webp_path, 'WEBP', quality=80, method=6)
                        
                        original_size = file_path.stat().st_size
                        new_size = webp_path.stat().st_size
                        saved = original_size - new_size
                        saved_space += saved
                        
                        print(f"Converted: {file} -> {webp_path.name} (Saved {saved/1024:.1f} KB)")
                        count += 1
                except Exception as e:
                    print(f"Error converting {file}: {e}")

    print(f"\nAuthorization Complete!")
    print(f"Total Images Converted: {count}")
    print(f"Total Space Saved: {saved_space/1024/1024:.2f} MB")

if __name__ == "__main__":
    convert_to_webp("img")
