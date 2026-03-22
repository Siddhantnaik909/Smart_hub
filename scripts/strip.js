const fs = require('fs');
const filepath = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/calculators.html';
let text = fs.readFileSync(filepath, 'utf8');
text = text.replace(/^[0-9]+:\s/gm, '');
fs.writeFileSync(filepath, text, 'utf8');
console.log('Stripped line numbers.');
