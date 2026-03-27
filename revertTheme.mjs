import fs from 'fs';

const pages = [
  'src/app/features/page.tsx',
  'src/app/use-cases/page.tsx',
  'src/app/how-it-works/page.tsx',
  'src/app/demo/page.tsx',
  'src/app/team/page.tsx',
  'src/app/page.tsx',
  'src/components/GlobalNav.tsx',
  'src/components/SiteFooterSections.tsx',
  'src/components/PreOrderModal.tsx',
  'src/components/HeroScroll.tsx'
];

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');

  // Inverse Custom Variables
  content = content.replace(/const CYAN = '#2563eb';/g, "const CYAN = '#00eaff';");
  content = content.replace(/const DARK = '#f8fafc';/g, "const DARK = '#060c18';");
  
  // Inverse Text Colors
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-slate-700/g, 'text-[#dee3ea]');
  content = content.replace(/text-blue-600/g, 'text-[#00eaff]');
  content = content.replace(/text-slate-600/g, 'text-[#d4e4f5]');
  content = content.replace(/text-slate-500/g, 'text-[#849495]');

  // Inverse Background Colors (bg-white is mapped to #0a0e14 because that's what HeroScroll and page.tsx use)
  content = content.replace(/bg-slate-50/g, 'bg-[#060c18]');
  content = content.replace(/bg-white/g, 'bg-[#0a0e14]');
  content = content.replace(/bg-slate-100/g, 'bg-[#0d1a26]');
  content = content.replace(/bg-slate-200/g, 'bg-[#1a2738]');
  content = content.replace(/bg-blue-600/g, 'bg-[#00eaff]');

  // Inverse Border Colors
  content = content.replace(/border-blue-600/g, 'border-[#00eaff]');
  content = content.replace(/border-slate-300/g, 'border-[#dee3ea]');
  content = content.replace(/border-slate-200/g, 'border-[#2a3b4c]');
  
  // Inverse Selection
  content = content.replace(/selection:bg-blue-200/g, 'selection:bg-[#00eaff]');
  content = content.replace(/selection:text-blue-900/g, 'selection:text-[#060c18]');

  // Inverse Shadow/Glow colors
  content = content.replace(/#3b82f6/g, '#00eaff');
  content = content.replace(/#f8fafc/g, '#060c18');
  content = content.replace(/#ffffff/g, '#0a0e14');

  fs.writeFileSync(p, content, 'utf8');
}

console.log('Theme reverted dynamically.');
