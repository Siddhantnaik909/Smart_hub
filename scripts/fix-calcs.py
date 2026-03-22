import re

filepath = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/calculators.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

links = {
    'Brick Estimator': '/calculators/construction/calc_brick.html',
    'Concrete Calc': '/calculators/construction/calc_concrete.html',
    'Flooring': '/calculators/construction/calc_flooring.html',
    'Roof Area': '/calculators/construction/calc_roof_area.html',
    'MD5 Hash': '/calculators/cryptography/tool_md5_generator.html',
    'SHA-256': '/calculators/cryptography/tool_sha256_generator.html',
    'Gen Pass': '/calculators/general-math/tool_password.html',
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
    'World Clock': '/calculators/date-time/calc_time_zone.html',
    'Age Calc': '/calculators/date-time/calc_age.html',
    'Base64': '/calculators/cryptography/tool_base64.html',
    'Case Conv': '/calculators/text-web/tool_case_converter.html',
    'URL Decode': '/calculators/text-web/tool_url_encoder.html',
    'GPA Calc': '/calculators/students/calc_gpa.html',
    'Equation Solver': '/calculators/students/calc_quadratic.html',
    'Geometry': '/calculators/students/calc_geometry.html',
    'Percentage': '/calculators/general-math/calc_percentage.html',
    'Statistics': '/calculators/students/calc_statistics.html',
    'Unit Conv': '/calculators/students/calc_unit_conv.html',
    'Dice Roller': '/calculators/fun/calc_dice_roller.html',
    '8 Ball': '/calculators/fun/calc_magic_8_ball.html',
    'Love Calc': '/calculators/fun/calc_love.html',
    'Fortune': '/calculators/fun/calc_fortune_cookie.html'
}

for name, href in links.items():
    # Grid buttons format
    pattern = r'(<button class="tool-card[^"]*")([^>]*?>[\s\S]*?<span class="text-\[11px\] font-bold text-center">)' + re.escape(name) + r'(</span>\s*</button>)'
    
    def repl(m):
        return '<a href="' + href + '" ' + m.group(1)[8:] + m.group(2) + name + '</span></a>'
        
    text = re.sub(pattern, repl, text)
    
    # Network section list buttons format
    net_pattern = r'(<button class="w-full flex[^"]*")([^>]*?>\s*<div class="flex items-center gap-3">\s*<span class="material-symbols-outlined.*?>.*?</span>\s*<span class="text-xs font-bold">)' + re.escape(name) + r'(</span>\s*</div>\s*<span class="material-symbols-outlined.*?>chevron_right</span>\s*</button>)'
    def net_repl(m):
        return '<a href="' + href + '" class="w-full ' + m.group(1)[13:] + m.group(2) + name + '</span></div><span class="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span></a>'
    
    text = re.sub(net_pattern, net_repl, text)

# Convert all remaining dummy buttons
text = re.sub(r'<button class="tool-card', r'<a href="#" class="tool-card', text)
text = re.sub(r'</span>\s*</button>', r'</span>\n</a>', text)

text = re.sub(r'<button class="w-full flex', r'<a href="#" class="w-full flex', text)
text = re.sub(r'chevron_right</span>\s*</button>', r'chevron_right</span></a>', text)

text = text.replace('<a class="text-primary border-b-2 border-primary pb-1" href="#">Tools</a>', '<a class="text-primary border-b-2 border-primary pb-1" href="/calculators.html">Tools</a>')
text = text.replace('<a class="hover:text-primary transition-colors" href="#">Games</a>', '<a class="hover:text-primary transition-colors" href="/GameLobby.html">Games</a>')
text = text.replace('<a class="hover:text-primary transition-colors" href="#">About</a>', '<a class="hover:text-primary transition-colors" href="/about.html">About</a>')
text = text.replace('href="#">\n<span class="material-symbols-outlined">home</span>', 'href="/index.html">\n<span class="material-symbols-outlined">home</span>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)
print("Done")
