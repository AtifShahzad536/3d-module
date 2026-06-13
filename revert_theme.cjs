const fs = require('fs');
const p = 'src/components/builder/RightPanel.jsx';
let code = fs.readFileSync(p, 'utf8');

const map = {
  'bg-\\[#0d0d0d\\]': 'bg-white',
  'bg-white/5': 'bg-gray-50',
  'border-white/5': 'border-gray-50',
  'border-white/10': 'border-gray-100',
  'border-white/20': 'border-gray-300',
  'text-white': 'text-gray-900',
  'text-gray-200': 'text-gray-800',
  'text-gray-300': 'text-gray-700',
  'text-gray-400': 'text-gray-600',
  'text-gray-500': 'text-gray-400',
  'text-gray-600': 'text-gray-300',
  'bg-white/10': 'bg-gray-200',
  'bg-\\[#171717\\]': 'bg-gray-800',
  'bg-\\[#00e5ff\\]/10': 'bg-blue-50',
  'border-\\[#00e5ff\\]/20': 'border-blue-100',
  'text-\\[#00e5ff\\]': 'text-blue-600',
  'border-\\[#00e5ff\\]': 'border-blue-600',
  'bg-\\[#00e5ff\\]': 'bg-blue-600',
  'bg-\\[#00e5ff\\]/20': 'bg-blue-100',
  'ring-\\[#00e5ff\\]/30': 'ring-blue-100',
  'ring-\\[#00e5ff\\]': 'ring-blue-600',
  'shadow-\\[0_0_10px_rgba\\(0,229,255,0\\.2\\)\\]': 'shadow-blue-500/10',
  'shadow-\\[0_0_20px_rgba\\(0,229,255,0\\.3\\)\\]': 'shadow-blue-500/20',
  'custom-scrollbar-dark': 'custom-scrollbar',
  'bg-\\[#0a0a0a\\]': 'bg-white',
  'bg-\\[#00ff66\\]/10': 'bg-green-50',
  'text-\\[#00ff66\\]': 'text-green-600',
  'border-\\[#00ff66\\]/20': 'border-green-200',
  'hover:bg-white/5': 'hover:bg-gray-50',
  'hover:bg-white/10': 'hover:bg-gray-100',
  'hover:border-white/10': 'hover:border-gray-100',
  'hover:border-white/20': 'hover:border-gray-300',
  'hover:text-white': 'hover:text-gray-900',
};

Object.entries(map).forEach(([k, v]) => {
  const regex = new RegExp('(?<=\\s|\'|"|`|^)' + k + '(?=\\s|\'|"|`|$)', 'g');
  code = code.replace(regex, v);
});

fs.writeFileSync(p, code);
console.log('RightPanel reverted to bright theme!');
