// Simple bundler: concatenates compiled ES modules into a single IIFE bundle
// No external dependencies required at runtime
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Topological order of modules
const modules = [
  'game/Block.js',
  'game/GameState.js',
  'game/BoardProfile.js',
  'game/GameInfo.js',
  'game/Board.js',
  'game/Mahjong.js',
  'game/index.js',
  'storage/GameStorage.js',
  'storage/index.js',
  'ui/AssetGenerator.js',
  'ui/Renderer.js',
  'ui/InputHandler.js',
  'ui/index.js',
  'audio/SoundManager.js',
  'App.js',
  'main.js',
];

let bundle = '(function() {\n"use strict";\n\n';

// Module registry
bundle += 'const __modules = {};\nconst __exports = {};\n\n';
bundle += 'function __require(name) {\n  if (__exports[name]) return __exports[name];\n  __exports[name] = {};\n  __modules[name](__exports[name]);\n  return __exports[name];\n}\n\n';

for (const mod of modules) {
  const filePath = path.join(distDir, mod);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing: ${filePath}`);
    continue;
  }

  let code = fs.readFileSync(filePath, 'utf-8');

  // Remove import statements and rewrite to __require
  code = code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g, (match, imports, from) => {
    const modName = resolveModule(mod, from);
    const importNames = imports.split(',').map(s => s.trim());
    return importNames.map(name => {
      const parts = name.split(/\s+as\s+/);
      const original = parts[0].trim();
      const alias = (parts[1] || parts[0]).trim();
      return `var ${alias} = __require('${modName}').${original};`;
    }).join('\n');
  });

  // Handle re-exports: export { X } from './Y'
  code = code.replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g, (match, names, from) => {
    const modName = resolveModule(mod, from);
    const exportNames = names.split(',').map(s => s.trim());
    return exportNames.map(name => {
      const parts = name.split(/\s+as\s+/);
      const original = parts[0].trim();
      const alias = (parts[1] || parts[0]).trim();
      return `exports.${alias} = __require('${modName}').${original};`;
    }).join('\n');
  });

  // Remove 'export ' prefix from declarations
  code = code.replace(/^export\s+(const|let|var|function|class)\s/gm, '$1 ');

  // Remove remaining plain export statements (export { X };)
  code = code.replace(/^export\s*\{[^}]*\}\s*;?$/gm, '');

  // Remove Object.defineProperty exports from tsc output
  code = code.replace(/Object\.defineProperty\(exports,\s*"__esModule"[^)]*\)\s*;?/g, '');

  // Wrap as module
  const modKey = mod.replace(/\.js$/, '');
  bundle += `// --- ${mod} ---\n`;
  bundle += `__modules['${modKey}'] = function(exports) {\n`;

  // Add exports for declared classes/consts/functions at top level
  const classMatches = code.match(/^(?:class|const|function)\s+(\w+)/gm) || [];
  const exportNames = classMatches.map(m => m.replace(/^(class|const|function)\s+/, ''));

  bundle += code + '\n';

  for (const name of exportNames) {
    bundle += `  try { exports.${name} = ${name}; } catch(e) {}\n`;
  }

  bundle += '};\n\n';
}

// Boot
bundle += "__require('main');\n";
bundle += '})();\n';

const outPath = path.join(distDir, 'bundle.js');
fs.writeFileSync(outPath, bundle);
console.log(`Bundle written to ${outPath} (${(bundle.length / 1024).toFixed(1)} KB)`);

function resolveModule(fromMod, importPath) {
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const fromDir = path.dirname(fromMod);
    let resolved = path.join(fromDir, importPath).replace(/\\/g, '/');
    // Remove .js extension for key
    return resolved.replace(/\.js$/, '');
  }
  return importPath.replace(/\.js$/, '');
}
