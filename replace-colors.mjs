import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const replacements = [
  { regex: /bg-\[#0A0A0F\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#111118\]/g, replacement: 'bg-surface' },
  { regex: /bg-\[#16161F\]/g, replacement: 'bg-muted' },
  { regex: /text-\[#F0F0F0\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#888899\]/g, replacement: 'text-muted-foreground' },
  { regex: /text-\[#444455\]/g, replacement: 'text-muted-foreground' },
  { regex: /border-\[rgba\(255,255,255,0\.08\)\]/g, replacement: 'border-border' },
  { regex: /border-\[rgba\(255,255,255,0\.12\)\]/g, replacement: 'border-border' },
  { regex: /border-\[rgba\(255,255,255,0\.04\)\]/g, replacement: 'border-border' },
  { regex: /bg-\[rgba\(255,255,255,0\.08\)\]/g, replacement: 'bg-border' },
  { regex: /bg-\[rgba\(255,255,255,0\.03\)\]/g, replacement: 'bg-border/50' },
  { regex: /bg-\[rgba\(255,255,255,0\.02\)\]/g, replacement: 'bg-border/30' },
  { regex: /fill-\[#0A0A0F\]/g, replacement: 'fill-background' },
  { regex: /fill-\[#F0F0F0\]/g, replacement: 'fill-foreground' },
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
