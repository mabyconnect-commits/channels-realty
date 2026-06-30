// Syntax-check every serverless function + lib (CommonJS) without executing them.
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

const root = path.join(__dirname, '..');
const files = ['api', 'lib', 'prisma', 'scripts'].flatMap((d) => {
  const dir = path.join(root, d);
  return fs.existsSync(dir) ? walk(dir) : [];
});

let bad = 0;
for (const f of files) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); console.log('ok   ' + path.relative(root, f)); }
  catch (e) { bad++; console.error('FAIL ' + path.relative(root, f) + '\n' + String(e.stderr || e.message).split('\n').slice(0, 2).join('\n')); }
}
console.log(bad ? `\n${bad} file(s) failed` : `\nAll ${files.length} JS files pass`);
process.exit(bad ? 1 : 0);
