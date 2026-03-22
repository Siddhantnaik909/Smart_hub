const fs = require('fs');

const filepath = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/calculators.html';
let text = fs.readFileSync(filepath, 'utf8');

const links = {
    'Brick Estimator': '/calculators/construction/calc_brick.html',
    'Concrete Calc': '/calculators/construction/calc_concrete.html',
    'Flooring': '/calculators/construction/calc_flooring.html',
    'Roof Area': '/calculators/construction/calc_roof_area.html',
    'MD5 Hash': '/calculators/cryptography/tool_md5_generator.html',
    'SHA-256': '/calculators/cryptography/tool_sha256_generator.html',
    'Gen Pass': '/calculators/general-math/tool_password.html',
    'AES Encrypt': '#',
    'Live Forex': '/calculators/finance/calc_currency.html',
    'Mortgage': '/calculators/finance/calc_mortgage.html',
    'Interest': '/calculators/finance/calc_compound_interest.html',
    'ROI Calc': '/calculators/finance/calc_roi.html',
    "Ohm's Law": '/calculators/electronics/calc_ohm.html',
    'Power Unit': '/calculators/electronics/calc_power.html',
    'Resistor Color': '/calculators/electronics/calc_resistor_color_code.html',
    'Capacitance': '/calculators/electronics/calc_capacitor_code.html',
    'BMI Calc': '/calculators/health-fitness/calc_bmi.html',
    'Calorie Burn': '/calculators/health-fitness/calc_calorie.html',
    'Hydration': '/calculators/health-fitness/calc_water.html',
    'Pregnancy': '/calculators/health-fitness/calc_pregnancy.html',
    'DNS Lookup': '/calculators/network/tool_dns_lookup.html',
    'Ping Test': '/calculators/network/tool_ping.html',
    'IP Geo': '/calculators/network/tool_ip_geo.html',
    'Day Diff': '/calculators/date-time/calc_date_diff.html',
    'Unix Time': '#',
    'World Clock': '/calculators/date-time/calc_time_zone.html',
    'Age Calc': '/calculators/date-time/calc_age.html',
    'Base64': '/calculators/cryptography/tool_base64.html',
    'Case Conv': '/calculators/text-web/tool_case_converter.html',
    'JS Minify': '#',
    'URL Decode': '/calculators/text-web/tool_url_encoder.html',
    'GPA Calc': '/calculators/students/calc_gpa.html',
    'Citation': '#',
    'Equation Solver': '/calculators/students/calc_quadratic.html',
    'Periodic': '#',
    'Geometry': '/calculators/students/calc_geometry.html',
    'Percentage': '/calculators/general-math/calc_percentage.html',
    'Statistics': '/calculators/students/calc_statistics.html',
    'Unit Conv': '/calculators/students/calc_unit_conv.html',
    'Sudoku': '#',
    'Minesweeper': '#',
    'CPS Test': '#',
    '2048': '#',
    'Dice Roller': '/calculators/fun/calc_dice_roller.html',
    '8 Ball': '/calculators/fun/calc_magic_8_ball.html',
    'Love Calc': '/calculators/fun/calc_love.html',
    'Fortune': '/calculators/fun/calc_fortune_cookie.html'
};

// Replace <button class="tool-card..."> ... </button>
text = text.replace(/<button class="tool-card([\s\S]*?)<\/button>/g, (match) => {
    // Find the name inside the span
    let matchName = match.match(/<span class="text-\[11px\] font-bold text-center">(.*?)<\/span>/);
    let name = matchName ? matchName[1] : '';
    let href = links[name] || '#';
    
    // Replace <button with <a href="..."
    let newStr = match.replace(/<button class="tool-card/, '<a href="' + href + '" class="tool-card');
    newStr = newStr.replace(/<\/button>$/, '</a>');
    return newStr;
});

// Replace <button class="w-full flex..."> ... </button> (Network items)
text = text.replace(/<button class="w-full flex([\s\S]*?)<\/button>/g, (match) => {
    let matchName = match.match(/<span class="text-xs font-bold">(.*?)<\/span>/);
    if (!matchName) return match;
    let name = matchName[1];
    let href = links[name] || '#';
    
    let newStr = match.replace(/<button class="w-full flex/, '<a href="' + href + '" class="w-full flex');
    newStr = newStr.replace(/<\/button>$/, '</a>');
    return newStr;
});

// Fix global navigation
text = text.replace('<a class="text-primary border-b-2 border-primary pb-1" href="#">Tools</a>', '<a class="text-primary border-b-2 border-primary pb-1" href="/calculators.html">Tools</a>');
text = text.replace('<a class="hover:text-primary transition-colors" href="#">Games</a>', '<a class="hover:text-primary transition-colors" href="/GameLobby.html">Games</a>');
text = text.replace('<a class="hover:text-primary transition-colors" href="#">About</a>', '<a class="hover:text-primary transition-colors" href="/about.html">About</a>');
text = text.replace('href="#">\n<span class="material-symbols-outlined">home</span>', 'href="/index.html">\n<span class="material-symbols-outlined">home</span>');

fs.writeFileSync(filepath, text, 'utf8');
console.log('Fixed cleanly.');
