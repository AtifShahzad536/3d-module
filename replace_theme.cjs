const fs = require('fs');
const p = 'src/components/builder/RightPanel.jsx';
let code = fs.readFileSync(p, 'utf8');

const map = {
  'bg-white': 'bg-[#0a0a0a]',
  'bg-gray-50': 'bg-white/5',
  'border-gray-50': 'border-white/5',
  'border-gray-100': 'border-white/10',
  'border-gray-200': 'border-white/10',
  'border-gray-300': 'border-white/20',
  'text-gray-900': 'text-white',
  'text-gray-800': 'text-gray-200',
  'text-gray-700': 'text-gray-300',
  'text-gray-600': 'text-gray-400',
  'text-gray-500': 'text-gray-400',
  'text-gray-400': 'text-gray-500',
  'text-gray-300': 'text-gray-600',
  'bg-gray-200': 'bg-white/10',
  'bg-gray-100': 'bg-white/5',
  'bg-gray-800': 'bg-[#171717]',
  'bg-blue-50': 'bg-[#00e5ff]/10',
  'border-blue-100': 'border-[#00e5ff]/20',
  'text-blue-600': 'text-[#00e5ff]',
  'text-blue-700': 'text-[#00e5ff]',
  'border-blue-600': 'border-[#00e5ff]',
  'bg-blue-600': 'bg-[#00e5ff]',
  'bg-blue-100': 'bg-[#00e5ff]/20',
  'ring-blue-100': 'ring-[#00e5ff]/30',
  'ring-blue-600': 'ring-[#00e5ff]',
  'shadow-blue-500/10': 'shadow-[0_0_10px_rgba(0,229,255,0.2)]',
  'shadow-blue-500/20': 'shadow-[0_0_20px_rgba(0,229,255,0.3)]',
  'custom-scrollbar': 'custom-scrollbar-dark'
};

Object.entries(map).forEach(([k, v]) => {
  // Replace only full tailwind class names
  const regex = new RegExp('(?<=\\s|\'|"|`|^)' + k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '(?=\\s|\'|"|`|$)', 'g');
  code = code.replace(regex, v);
});

// Specific fix for text on cyan background
code = code.replace(/bg-\[\#00e5ff\] text-white/g, 'bg-[#00e5ff] text-black');

fs.writeFileSync(p, code);
console.log('Done mapping tailwind classes!');
