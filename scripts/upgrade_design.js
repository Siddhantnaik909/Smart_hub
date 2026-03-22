const fs = require('fs');
const path = require('path');

const TEXT_REPLACEMENTS = {
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
};

const NAVBAR_TEMPLATE = `    <nav class="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(139,92,246,0.06)] h-20 flex items-center px-12 tracking-tight">
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
    </nav>`;

const FOOTER_TEMPLATE = `    <footer class="w-full py-12 border-t border-slate-200/50 bg-slate-100 text-sm font-['Plus_Jakarta_Sans']">
        <div class="max-w-[1440px] mx-auto px-12 flex justify-between items-center">
            <span class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">© 2026 Smart Hub | Helping you work smarter</span>
            <div class="flex gap-8 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                <a class="hover:text-primary transition-colors" href="/history.html">History</a>
                <a class="hover:text-primary transition-colors" href="/about.html">About</a>
                <a class="hover:text-primary transition-colors" href="/privacy.html">Privacy</a>
            </div>
        </div>
    </footer>`;

function upgradeFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Normalize Navbar (regex for any <nav> reaching </nav>)
    content = content.replace(/<nav[\s\S]*?<\/nav>/, NAVBAR_TEMPLATE);
    
    // Normalize Footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, FOOTER_TEMPLATE);

    // Text Replacements
    for (const [old, newVal] of Object.entries(TEXT_REPLACEMENTS)) {
        const regex = new RegExp(old, 'g');
        content = content.replace(regex, newVal);
    }
    
    // Clean up
    content = content.replace(/\s\s+/g, ' ').replace(/\s\./g, '.').replace(/\s,/g, ',');

    fs.writeFileSync(filepath, content);
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html')) {
            console.log(`Upgrading: ${fullPath}`);
            try {
                upgradeFile(fullPath);
            } catch (e) {
                console.error(`Error upgrading ${fullPath}: ${e.message}`);
            }
        }
    }
}

const targetDir = path.join(__dirname, 'frontend/public/calculators');
walk(targetDir);
console.log("All calculators upgraded successfully.");
