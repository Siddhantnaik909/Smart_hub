const fs = require('fs');

const path = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/calculators/general-math/calc_standard.html';
let text = fs.readFileSync(path, 'utf8');

// Replace Display IDs
text = text.replace(
    '<div class="text-on-surface-variant text-xl font-medium tracking-tight mb-2">1,250 × 1.15</div>',
    '<div id="exprBox" class="text-on-surface-variant text-xl font-medium tracking-tight mb-2 min-h-[28px]">&nbsp;</div>'
);

text = text.replace(
    /<div\s*class="text-7xl font-extrabold tracking-tighter text-on-surface flex items-center justify-end gap-2">\s*<span class="w-1 h-14 bg-primary animate-pulse rounded-full"><\/span>\s*1,437\.50\s*<\/div>/,
    '<div id="displayBox" class="text-7xl font-extrabold tracking-tighter text-on-surface flex items-center justify-end gap-2"><span class="w-1 h-14 bg-primary animate-pulse rounded-full"></span>0</div>'
);

// Add onClicks to buttons
const replacements = [
    ['>MC</button>', ' onclick="app.clearMemory()">MC</button>'],
    ['>MR</button>', ' onclick="app.recallMemory()">MR</button>'],
    ['>M+</button>', ' onclick="app.addMemory()">M+</button>'],
    ['>Clear</button>', ' onclick="app.clearAll()">Clear</button>'],
    ['>7</button>', ' onclick="app.appendNum(\'7\')">7</button>'],
    ['>8</button>', ' onclick="app.appendNum(\'8\')">8</button>'],
    ['>9</button>', ' onclick="app.appendNum(\'9\')">9</button>'],
    ['>÷</button>', ' onclick="app.appendOp(\'/\')">÷</button>'],
    ['>4</button>', ' onclick="app.appendNum(\'4\')">4</button>'],
    ['>5</button>', ' onclick="app.appendNum(\'5\')">5</button>'],
    ['>6</button>', ' onclick="app.appendNum(\'6\')">6</button>'],
    ['>×</button>', ' onclick="app.appendOp(\'*\')">×</button>'],
    ['>1</button>', ' onclick="app.appendNum(\'1\')">1</button>'],
    ['>2</button>', ' onclick="app.appendNum(\'2\')">2</button>'],
    ['>3</button>', ' onclick="app.appendNum(\'3\')">3</button>'],
    ['>−</button>', ' onclick="app.appendOp(\'-\')">−</button>'],
    ['>&#8722;</button>', ' onclick="app.appendOp(\'-\')">−</button>'],
    ['>.</button>', ' onclick="app.appendNum(\'.\')">.</button>'],
    ['>0</button>', ' onclick="app.appendNum(\'0\')">0</button>'],
    ['>+</button>', ' onclick="app.appendOp(\'+\')">+</button>'],
    ['>=</button>', ' onclick="app.calculate()">=</button>']
];

for (const [oldVal, newVal] of replacements) {
    text = text.replace(oldVal, newVal);
}

// Add Scripts
const scripts = `    <script src="/js/component-loader.js"></script>
    <script type="module" src="/js/script.js"></script>
    <script src="/js/calc-utils.js"></script>
    <script src="/js/custom.js"></script>
    <script>
        window.FRONTEND_ROOT = "/"; window.COMPONENT_ROOT = "/components/";

        window.app = {
            cur: '0',
            prev: '',
            op: null,
            memory: 0,
            resetNext: false,
            
            clearMemory() {
                this.memory = 0;
            },
            recallMemory() {
                this.cur = this.memory.toString();
                this.update();
            },
            addMemory() {
                this.memory += parseFloat(this.cur || '0');
            },

            update() {
                const box = document.getElementById('displayBox');
                // Adjust font size scaling for UI
                let fontSize = 'text-7xl';
                if (this.cur.length > 9) fontSize = 'text-5xl';
                else if (this.cur.length > 7) fontSize = 'text-6xl';
                
                box.className = 'font-extrabold tracking-tighter text-on-surface flex items-center justify-end gap-2 ' + fontSize;

                let val = this.cur;
                if (val !== 'Error' && !val.includes('e')) {
                    const parts = val.split('.');
                    parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
                    val = parts.join('.');
                }
                
                box.innerHTML = '<span class="w-1 h-14 bg-primary animate-pulse rounded-full"></span>\\n' + val;

                // Show expression
                let expr = this.prev;
                if (this.op) {
                    const opChar = this.op === '/' ? '÷' : this.op === '*' ? '×' : this.op === '-' ? '−' : this.op;
                    expr += \` \${opChar} \`;
                }
                document.getElementById('exprBox').innerText = expr || '\\xa0';
            },

            clearAll() {
                this.cur = '0';
                this.prev = '';
                this.op = null;
                this.resetNext = false;
                this.update();
            },

            deleteLast() {
                if (this.resetNext || this.cur === 'Error') return;
                this.cur = this.cur.slice(0, -1);
                if (this.cur === '' || this.cur === '-') this.cur = '0';
                this.update();
            },

            appendNum(num) {
                if (this.resetNext) {
                    this.cur = num;
                    this.resetNext = false;
                } else {
                    if (this.cur === '0' && num !== '.') this.cur = num;
                    else if (num === '.' && this.cur.includes('.')) return;
                    else if (this.cur.replace(/[^0-9]/g, '').length < 15) this.cur += num;
                }
                this.update();
            },

            appendOp(operator) {
                if (this.cur === 'Error') return;

                if (operator === '%') {
                    this.cur = (parseFloat(this.cur) / 100).toString();
                    this.update();
                    return;
                }

                if (this.op && !this.resetNext) {
                    this.calculate(false);
                }

                this.prev = this.cur;
                this.op = operator;
                this.resetNext = true;
                this.update();
            },

            calculate(isFinal = true) {
                if (!this.op || this.cur === 'Error') return;

                const n1 = parseFloat(this.prev);
                const n2 = parseFloat(this.cur);
                let res = 0;

                switch (this.op) {
                    case '+': res = n1 + n2; break;
                    case '-': res = n1 - n2; break;
                    case '*': res = n1 * n2; break;
                    case '/':
                        if (n2 === 0) { this.cur = 'Error'; this.op = null; this.prev = ''; this.update(); return; }
                        res = n1 / n2;
                        break;
                }

                const finalStr = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString();

                if (isFinal) {
                    if (window.saveCalcToHistory && this.prev) {
                        const opStr = this.op === '/' ? '÷' : this.op === '*' ? '×' : this.op === '-' ? '−' : this.op;
                        window.saveCalcToHistory('Standard Calculator',
                            [{ label: 'Expression', val: \`\${n1} \${opStr} \${n2}\` }],
                            [{ label: 'Result', val: finalStr, highlight: true }]
                        );
                    }
                }

                this.cur = finalStr;
                if (isFinal) {
                    this.prev = '';
                    this.op = null;
                }
                this.resetNext = true;
                this.update();
            }
        };

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') app.appendNum(e.key);
            else if (['+', '-', '*', '/'].includes(e.key)) app.appendOp(e.key);
            else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); app.calculate(); }
            else if (e.key === 'Backspace') app.deleteLast();
            else if (e.key === 'Escape') app.clearAll();
        });
    </script>
</body>`;

text = text.replace('</body>', scripts);

fs.writeFileSync(path, text, 'utf8');
console.log('Fixed Standard Calc Script and Buttons');
