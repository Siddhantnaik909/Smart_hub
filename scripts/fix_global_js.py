import os
import re

def fix_file(filepath):
    print(f"Fixing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Restore id="nav-site-logo-text"
    content = re.sub(
        r'<span class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub<\/span>',
        r'<span id="nav-site-logo-text" class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub</span>',
        content
    )

    # 2. Ensure script.js is loaded as module
    if '/js/script.js' not in content:
        content = content.replace('</body>', '<script type="module" src="/js/script.js"></script>\n</body>')
    else:
        # Ensure it's type="module"
        content = re.sub(r'<script src="\/js\/script.js"><\/script>', r'<script type="module" src="/js/script.js"></script>', content)

    # 3. Ensure calc-utils.js is loaded if it's a calculator, tool, or game
    if 'calc_' in filepath or 'tool_' in filepath or 'game_' in filepath:
        if '/js/calc-utils.js' not in content:
            content = content.replace('</head>', '<script src="/js/calc-utils.js"></script>\n</head>')
            
        # 4. Ensure socket.io is loaded for multiplayer games
        multiplayer_games = ['game_tictactoe', 'game_tic_tac_toe', 'game_connect4', 'game_chess', 'game_car_racing']
        if any(game in filepath for game in multiplayer_games) and 'socket.io.min.js' not in content:
            content = content.replace('</head>', '<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>\n</head>')

    # 4. Fix history calls (standardize to window.saveCalcToHistory if possible, or leave as is)
    
    # 5. Un-minify major blocks (optional but helpful)
    # content = content.replace('> <', '>\n<') # Simple way to split tags
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def walk(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.html'):
                fix_file(os.path.join(root, file))

# Target folders
walk('frontend/public/calculators')
walk('frontend/public') # Catch main pages too

print("Global JS and Branding fixed across all pages.")
