// Offline Prisma schema validation via the WASM schema builder (no engine download).
// CI also runs `npx prisma validate`; this lets the same check run in the sandbox.
const fs = require('fs');
const path = require('path');

let wasm;
try { wasm = require('@prisma/prisma-schema-wasm'); }
catch (_) {
  console.log('skip: @prisma/prisma-schema-wasm not installed (CI runs `npx prisma validate` instead)');
  process.exit(0);
}

// The WASM panic hook expects this registry to exist.
if (!global.PRISMA_WASM_PANIC_REGISTRY) global.PRISMA_WASM_PANIC_REGISTRY = { set_message(m) { this.msg = m; } };

const schema = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8');
try {
  wasm.validate(JSON.stringify({ prismaSchema: [['schema.prisma', schema]], noColor: true }));
  console.log('Prisma schema is valid ✓');
} catch (e) {
  console.error('Prisma schema validation failed:\n' + (global.PRISMA_WASM_PANIC_REGISTRY.msg || e.message));
  process.exit(1);
}
