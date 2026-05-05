import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const replacements = [
  { regex: /(?<!bg-primary.*)\btext-white\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-gray-300\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-gray-200\b/g, replacement: 'text-foreground' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-slate-200\b/g, replacement: 'text-foreground' },
  { regex: /\bbg-black\b/g, replacement: 'bg-background' },
  { regex: /\bbg-gray-950\b/g, replacement: 'bg-background' },
  { regex: /\bbg-gray-900\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-gray-800\b/g, replacement: 'bg-muted' },
  { regex: /\bbg-slate-950\b/g, replacement: 'bg-background' },
  { regex: /\bbg-slate-900\b/g, replacement: 'bg-surface' },
  { regex: /\bbg-slate-800\b/g, replacement: 'bg-muted' },
  { regex: /\bborder-gray-800\b/g, replacement: 'border-border' },
  { regex: /\bborder-slate-800\b/g, replacement: 'border-border' },
  { regex: /\bborder-gray-700\b/g, replacement: 'border-border' },
  { regex: /\bborder-slate-700\b/g, replacement: 'border-border' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-border' },
  { regex: /\bborder-white\/20\b/g, replacement: 'border-border' },
  { regex: /\bbg-white\/5\b/g, replacement: 'bg-foreground/5' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-foreground/10' },
  { regex: /\bbg-white\/20\b/g, replacement: 'bg-foreground/20' },
  { regex: /\btext-white\/60\b/g, replacement: 'text-foreground/60' },
  { regex: /\btext-white\/70\b/g, replacement: 'text-foreground/70' },
  { regex: /\btext-white\/80\b/g, replacement: 'text-foreground/80' },
  { regex: /\btext-zinc-400\b/g, replacement: 'text-muted-foreground' },
  { regex: /\btext-zinc-300\b/g, replacement: 'text-muted-foreground' },
  { regex: /\bbg-zinc-900\b/g, replacement: 'bg-surface' },
  { regex: /\bborder-zinc-800\b/g, replacement: 'border-border' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Finished replacing hardcoded colors.');
