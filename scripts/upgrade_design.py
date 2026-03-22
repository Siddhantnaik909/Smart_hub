
import os
import re

# Replacements for Normal Text
TEXT_REPLACEMENTS = {
    "Academic Registry": "Grade Calculator",
    "Masonry Registry": "Brick & Building",
    "Registry mode": "Type",
    "Registry Mode": "Type",
    "COMMIT CALCULATION": "CALCULATE NOW",
    "COMMIT TO REGISTRY": "SAVE TO HISTORY",
    "Commit Calculation": "Calculate Now",
    "Commit to History": "Save to History",
    "Institutional tier": "Premium features",
    "Architecture": "Design",
    "Precision": "Accuracy",
    "Protocol": "Method",
    "Module": "Subject",
    "Flux": "",
    "Initialize": "Start",
    "Analyze": "Check",
    "High-fidelity": "Good quality",
    "Precision-guided": "Accurate",
}

NAVBAR_TEMPLATE = """    <nav class="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(139,92,246,0.06)] h-20 flex items-center px-12 tracking-tight">
        <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
            <div class="flex items-center gap-8">
                <span class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub</span>
                <div class="hidden md:flex items-center gap-6">
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/index.html">Home</a>
                    <a class="text-primary font-semibold border-b-2 border-primary pb-1" href="/calculators.html">Tools</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/GameLobby.html">Games</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/history.html">History</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/about.html">About</a>
                </div>
            </div>
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile"/>
            </div>
        </div>
    </nav>"""

FOOTER_TEMPLATE = """    <footer class="w-full py-12 border-t border-slate-200/50 bg-slate-100 text-sm font-['Plus_Jakarta_Sans']">
        <div class="max-w-[1440px] mx-auto px-12 flex justify-between items-center">
            <span class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">© 2026 Smart Hub | Helping you work smarter</span>
            <div class="flex gap-8 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                <a class="hover:text-primary transition-colors" href="/history.html">History</a>
                <a class="hover:text-primary transition-colors" href="/about.html">About</a>
                <a class="hover:text-primary transition-colors" href="/privacy.html">Privacy</a>
            </div>
        </div>
    </footer>"""

def upgrade_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize Navbar
    content = re.sub(r'<nav.*?</nav>', NAVBAR_TEMPLATE, content, flags=re.DOTALL)
    
    # Normalize Footer
    content = re.sub(r'<footer.*?</footer>', FOOTER_TEMPLATE, content, flags=re.DOTALL)

    # Text Replacements
    for old, new in TEXT_REPLACEMENTS.items():
        content = content.replace(old, new)
    
    # Clean up dual spaces or messy Flux remnants
    content = content.replace("  ", " ").replace(" .", ".").replace(" ,", ",")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = r"c:\Users\hp\OneDrive\Desktop\New folder\Smart_hub-main\frontend\public\calculators"
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                print(f"Upgrading: {path}")
                try:
                    upgrade_file(path)
                except Exception as e:
                    print(f"Error upgrading {path}: {e}")

if __name__ == "__main__":
    main()
