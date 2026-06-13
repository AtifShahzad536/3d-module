const fs = require('fs');
const p = 'src/components/builder/Navbar.jsx';
let code = fs.readFileSync(p, 'utf8');

const map = {
  'bg-\\[#0a0a0a\\]': 'bg-white',
  'border-white/5': 'border-gray-100',
  'border-white/10': 'border-gray-100',
  'bg-white/5': 'bg-gray-50',
  'bg-white/10': 'bg-gray-100',
  'text-gray-500': 'text-gray-400',
  'text-gray-400': 'text-gray-500',
  'text-gray-300': 'text-gray-600',
  'text-white': 'text-gray-900',
  'bg-\\[#00e5ff\\]': 'bg-blue-600',
  'bg-\\[#0f0f0f\\]': 'bg-white',
  'text-\\[#00e5ff\\]': 'text-blue-600',
  'text-black': 'text-white',
  'from-\\[#00e5ff\\]/10': 'from-blue-50',
  'bg-\\[#00ff66\\]/10': 'bg-green-50',
  'border-\\[#00ff66\\]/20': 'border-green-200',
  'text-\\[#00ff66\\]': 'text-green-600',
  'bg-black/40': 'bg-gray-50',
  'text-gray-200': 'text-gray-800',
  'hover:bg-white/5': 'hover:bg-gray-50',
  'hover:text-white': 'hover:text-gray-900',
  'group-hover:text-white': 'group-hover:text-gray-900',
  'shadow-black/20': 'shadow-gray-200',
  'shadow-\\[0_0_10px_rgba\\(0,229,255,0\\.4\\)\\]': 'shadow-md',
  'drop-shadow-\\[0_0_8px_rgba\\(0,229,255,0\\.5\\)\\]': '',
  'drop-shadow-\\[0_0_5px_rgba\\(0,255,102,0\\.5\\)\\]': '',
  'bg-\\[#00ff66\\]': 'bg-green-500',
  'shadow-\\[0_0_8px_#00ff66\\]': ''
};

Object.entries(map).forEach(([k, v]) => {
  const regex = new RegExp('(?<=\\s|\'|"|`|^)' + k + '(?=\\s|\'|"|`|$)', 'g');
  code = code.replace(regex, v);
});

fs.writeFileSync(p, code);
console.log('Navbar reverted!');
