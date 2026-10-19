// Builds dist/escape-room-fle.html: a single self-contained HTML file
// (inline CSS, inline JS with images embedded as base64 data URIs),
// openable directly (file://) with no server, no build tool, no login.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

function b64(path, mime) {
  const data = readFileSync(join(root, path));
  return `data:${mime};base64,${data.toString('base64')}`;
}

const assetDataUris = {
  'assets/logo.png': b64('assets/logo.png', 'image/png'),
  'assets/benedetto.jpg': b64('assets/benedetto.jpg', 'image/jpeg'),
  'assets/sede-1.jpg': b64('assets/sede-1.jpg', 'image/jpeg'),
  'assets/sede-2.jpg': b64('assets/sede-2.jpg', 'image/jpeg'),
  'assets/sede-3.jpg': b64('assets/sede-3.jpg', 'image/jpeg'),
  'assets/sede-4.jpg': b64('assets/sede-4.jpg', 'image/jpeg'),
  'assets/sede-5.jpg': b64('assets/sede-5.jpg', 'image/jpeg'),
  'assets/sede-6.jpg': b64('assets/sede-6.jpg', 'image/jpeg'),
  'assets/sede-7.jpg': b64('assets/sede-7.jpg', 'image/jpeg'),
};

const JS_ORDER = [
  'js/state.mjs',
  'js/room1.mjs',
  'js/room2.mjs',
  'js/room3.mjs',
  'js/room4.mjs',
  'js/room5.mjs',
  'js/room6.mjs',
  'js/finale.mjs',
  'js/ui.mjs',
  'js/render-room1.js',
  'js/render-room2.js',
  'js/render-room3.js',
  'js/render-room4.js',
  'js/render-room5.js',
  'js/render-room6.js',
  'js/render-finale.js',
  'js/main.js',
];

function stripModuleSyntax(src, filePath) {
  const lines = src.split('\n');
  const out = [];
  for (const line of lines) {
    if (/^\s*import\s.*from\s+['"].*['"];?\s*$/.test(line)) continue; // drop import lines
    out.push(
      line
        .replace(/^export\s+function\s+/, 'function ')
        .replace(/^export\s+const\s+/, 'const ')
        .replace(/^export\s+async\s+function\s+/, 'async function ')
    );
  }
  let code = out.join('\n');
  for (const [path, uri] of Object.entries(assetDataUris)) {
    code = code.split(`'${path}'`).join(`'${uri}'`);
  }
  return `// ---- ${filePath} ----\n${code}\n`;
}

const jsBundle = JS_ORDER.map((f) => stripModuleSyntax(readFileSync(join(root, f), 'utf8'), f)).join('\n');

const css = readFileSync(join(root, 'styles.css'), 'utf8');

const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fuga dalla Fondazione</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=Fira+Sans+Condensed:wght@700&family=Fira+Sans+Extra+Condensed:wght@800&display=swap" rel="stylesheet">
<style>
${css}
</style>
</head>
<body>
<div id="app"></div>
<script>
${jsBundle}
</script>
</body>
</html>
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'escape-room-fle.html'), html, 'utf8');
console.log('wrote dist/escape-room-fle.html,', Math.round(html.length / 1024), 'KB');
