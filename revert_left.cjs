const fs = require('fs');
const p = 'src/components/builder/LeftPanel.jsx';
let code = fs.readFileSync(p, 'utf8');

const map = {
  'bg-\\[#0d0d0d\\]/90': 'bg-white',
  'bg-\\[#0a0a0a\\]/80': 'bg-white',
  'bg-white/5': 'bg-gray-50',
  'border-white/5': 'border-gray-100',
  'border-white/10': 'border-gray-100',
  'text-white': 'text-gray-900',
  'text-gray-500': 'text-gray-400',
  'text-gray-400': 'text-gray-500',
  'text-gray-300': 'text-gray-700',
  'bg-\\[#00e5ff\\]/10': 'bg-blue-50',
  'text-\\[#00e5ff\\]': 'text-blue-600',
  'bg-\\[#00e5ff\\]': 'bg-blue-600',
  'bg-black/50': 'bg-white',
  'bg-black/40': 'bg-gray-50',
  'bg-transparent': 'bg-white',
  'text-\\[#00e5ff\\]/60': 'text-gray-300',
  'bg-\\[#00ff66\\]': 'bg-green-500',
  'shadow-\\[0_0_8px_#00ff66\\]': '',
  'shadow-\\[0_0_15px_rgba\\(0,0,0,0\\.5\\)\\]': 'shadow-lg',
  'shadow-\\[10px_0_30px_rgba\\(0,0,0,0\\.5\\)\\]': 'shadow-sm',
  'shadow-\\[20px_0_50px_rgba\\(0,0,0,0\\.5\\)\\]': 'shadow-2xl',
  'shadow-\\[0_10px_30px_rgba\\(0,0,0,0\\.5\\)\\]': 'shadow-xl',
  'shadow-\\[2px_0_8px_rgba\\(0,229,255,0\\.5\\)\\]': '',
  'shadow-\\[2px_0_8px_rgba\\(0,229,255,0\\.4\\)\\]': 'shadow-[2px_0_8px_rgba(37,99,235,0.4)]',
  'shadow-\\[0_0_10px_#00e5ff\\]': '',
  'backdrop-blur-xl': '',
  'backdrop-blur-md': '',
  'custom-scrollbar-dark': 'no-scrollbar',
  'bg-\\[#171717\\]': 'bg-gray-900',
  'hover:text-white': 'hover:text-gray-900',
  'hover:bg-white/5': 'hover:bg-gray-100',
  'hover:bg-white/10': 'hover:bg-gray-100',
  'group-hover:text-white': 'group-hover:text-gray-900',
  'group-hover:text-gray-300': 'group-hover:text-gray-400',
};

Object.entries(map).forEach(([k, v]) => {
  const regex = new RegExp('(?<=\\s|\'|"|`|^)' + k + '(?=\\s|\'|"|`|$)', 'g');
  code = code.replace(regex, v);
});

fs.writeFileSync(p, code);
console.log('LeftPanel reverted to bright theme!');
