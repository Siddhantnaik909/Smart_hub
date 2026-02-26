import os
import re

# Define the root of the frontend public directory
# Assumes this script is placed in the project root
BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend', 'public')

def fix_css_path(match):
    # match.group(1) is the opening quote (href=")
    # match.group(2) is the path + closing quote (style.css")
    p1 = match.group(1)
    p2 = match.group(2)
    
    quote = p1[-1]
    path_val = p2[:-1] # strip closing quote
    
    # Extract filename (handle both / and \ separators just in case)
    filename = os.path.basename(path_val.replace('\\', '/'))
    
    # Return absolute path /css/filename.css
    return f'{p1}/css/{filename}{quote}'

def fix_js_path(match):
    # match.group(1) is the opening quote (src=")
    # match.group(2) is the path + closing quote (script.js")
    p1 = match.group(1)
    p2 = match.group(2)
    
    quote = p1[-1]
    path_val = p2[:-1] # strip closing quote
    
    filename = os.path.basename(path_val.replace('\\', '/'))
    
    # Return absolute path /js/filename.js
    return f'{p1}/js/{filename}{quote}'

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 1. Fix CSS Paths
        # Looks for href="..." ending in .css, ignoring http, #, or existing /css/
        content = re.sub(r'(href=["\'])(?!http|#|/css/)([^"\']*\.css["\'])', fix_css_path, content)
        
        # 2. Fix JS Paths
        # Looks for src="..." ending in .js, ignoring http or existing /js/
        content = re.sub(r'(src=["\'])(?!http|/js/)([^"\']*\.js["\'])', fix_js_path, content)
        
        # 3. Fix Global Variables for Component Loader
        if 'window.FRONTEND_ROOT' in content:
            content = re.sub(r'window\.FRONTEND_ROOT\s*=\s*["\'][^"\']*["\']', 'window.FRONTEND_ROOT = "/"', content)
            content = re.sub(r'window\.COMPONENT_ROOT\s*=\s*["\'][^"\']*["\']', 'window.COMPONENT_ROOT = "/components/"', content)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {os.path.relpath(filepath, BASE_DIR)}")
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    if not os.path.exists(BASE_DIR):
        print(f"Error: Directory not found: {BASE_DIR}")
        return

    print(f"Scanning for HTML files in: {BASE_DIR}")
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.lower().endswith('.html'):
                process_file(os.path.join(root, file))
    print("Path correction complete.")

if __name__ == "__main__":
    main()