// Compile every assets/*.jsx with the bundled Babel standalone to catch syntax errors.
const fs = require('fs');
const path = require('path');
const Babel = require('../assets/babel.min.js');

const dir = path.join(__dirname, '..', 'assets');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jsx')).sort();
let bad = 0;
for (const f of files) {
  try {
    Babel.transform(fs.readFileSync(path.join(dir, f), 'utf8'), { presets: ['react'], filename: f });
    console.log('ok   ' + f);
  } catch (e) {
    bad++;
    console.error('FAIL ' + f + ' :: ' + e.message.split('\n')[0]);
  }
}
console.log(bad ? `\n${bad} file(s) failed` : `\nAll ${files.length} JSX files compile`);
process.exit(bad ? 1 : 0);
