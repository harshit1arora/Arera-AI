import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const replacements = [
  // Any dark background -> bg-background or bg-surface
  { regex: /bg-\[#[0-2][0-9a-fA-F]{5}\]/g, replacement: 'bg-background' },
  { regex: /bg-\[#[0-2][0-9a-fA-F]{2}\]/g, replacement: 'bg-background' },
  // Any light text -> text-foreground
  { regex: /text-\[#[c-fC-F][0-9a-fA-F]{5}\]/g, replacement: 'text-foreground' },
  { regex: /text-\[#[c-fC-F][0-9a-fA-F]{2}\]/g, replacement: 'text-foreground' },
  // Any medium/gray text -> text-muted-foreground
  { regex: /text-\[#[3-b3-B][0-9a-fA-F]{5}\]/g, replacement: 'text-muted-foreground' },
  // rgba borders -> border-border
  { regex: /border-\[rgba\([^\]]+\)\]/g, replacement: 'border-border' },
  // rgba backgrounds (usually light overlay on dark) -> bg-foreground/5
  { regex: /bg-\[rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)\]/g, replacement: 'bg-foreground/5' },
  // rgba text -> text-foreground/x
  { regex: /text-\[rgba\(255,\s*255,\s*255,\s*0\.[0-9]+\)\]/g, replacement: 'text-foreground/70' }
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
console.log('Finished replacing hex colors.');
