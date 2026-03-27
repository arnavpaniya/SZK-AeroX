import fs from 'fs';

const pages = [
  'src/app/features/page.tsx',
  'src/app/use-cases/page.tsx',
  'src/app/how-it-works/page.tsx',
  'src/app/demo/page.tsx',
  'src/app/team/page.tsx',
  'src/components/GlobalNav.tsx',
  'src/components/SiteFooterSections.tsx',
  'src/components/PreOrderModal.tsx',
  'src/components/HeroScroll.tsx'
];

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  let content = fs.readFileSync(p, 'utf8');
  
  // Custom Variables (if present)
  content = content.replace(/const CYAN = '#00eaff';/g, "const CYAN = '#2563eb';");
  content = content.replace(/const DARK = '#060c18';/g, "const DARK = '#f8fafc';");
  
  // Text Colors
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-\[\#dee3ea\]/g, 'text-slate-700');
  content = content.replace(/text-\[\#00eefc\]/g, 'text-blue-600');
  content = content.replace(/text-\[\#00eaff\]/g, 'text-blue-600');
  content = content.replace(/text-\[\#d4e4f5\]/g, 'text-slate-600');
  content = content.replace(/text-\[\#849495\]/g, 'text-slate-500');
  content = content.replace(/text-\[\#7a94a8\]/g, 'text-slate-500');

  // Background Colors
  content = content.replace(/bg-\[\#060c18\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#0a0e14\]/g, 'bg-white');
  content = content.replace(/bg-\[\#0d1a26\]/g, 'bg-slate-100');
  content = content.replace(/bg-\[\#1a2738\]/g, 'bg-slate-200');
  content = content.replace(/bg-\[\#122232\]/g, 'bg-slate-200');
  content = content.replace(/bg-\[\#00eefc\]/g, 'bg-blue-600');
  content = content.replace(/bg-\[\#00eaff\]/g, 'bg-blue-600');

  // Border Colors
  content = content.replace(/border-\[\#00eefc\]/g, 'border-blue-600');
  content = content.replace(/border-\[\#00eaff\]/g, 'border-blue-600');
  content = content.replace(/border-\[\#dee3ea\]/g, 'border-slate-300');
  content = content.replace(/border-\[\#2a3b4c\]/g, 'border-slate-200');
  content = content.replace(/border-\[\#1a2738\]/g, 'border-slate-200');
  
  // Selection
  content = content.replace(/selection:bg-\[\#00eaff\]/g, 'selection:bg-blue-200');
  content = content.replace(/selection:text-\[\#060c18\]/g, 'selection:text-blue-900');

  // Shadow/Glow colors
  content = content.replace(/#00eaff/g, '#3b82f6'); // Generic replace for remaining hexes (blue-500)
  content = content.replace(/#00eefc/g, '#3b82f6');
  content = content.replace(/#060c18/g, '#f8fafc'); 
  content = content.replace(/#0a0e14/g, '#ffffff');

  fs.writeFileSync(p, content, 'utf8');
}

console.log('Theme conversion applied.');
