const fs = require('fs');
const path = 'src/components/builder/RightPanel.jsx';

if (fs.existsSync(path)) {
  let code = fs.readFileSync(path, 'utf8');

  // 1. Color Swatches: rounded-none -> rounded-full
  code = code.replace(/swatch aspect-square rounded-none/g, 'swatch aspect-square rounded-full');
  
  // 2. Sliders: h-1.5 bg-slate-200 rounded-none -> h-1.5 bg-slate-200 rounded-full
  code = code.replace(/h-1\.5 bg-slate-200 rounded-none/g, 'h-1.5 bg-slate-200 rounded-full');
  
  // 3. Small color dots (w-4 h-4 rounded-none) -> rounded-full
  code = code.replace(/w-4 h-4 rounded-none/g, 'w-4 h-4 rounded-full');
  code = code.replace(/w-7 h-7 rounded-none/g, 'w-7 h-7 rounded-full');
  
  // 4. Color grid big swatch (w-10 h-10) -> rounded-xl
  code = code.replace(/w-10 h-10 rounded-none/g, 'w-10 h-10 rounded-2xl');
  
  // 5. Thumbnails (w-8 h-8 rounded-none) -> rounded-lg
  code = code.replace(/w-8 h-8 rounded-none/g, 'w-8 h-8 rounded-lg');
  
  // 6. Decal Cards (p-3.5 rounded-none border) -> p-4 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5
  code = code.replace(/p-3\.5 rounded-none border transition-all/g, 'p-4 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all');
  
  // 7. Generic inputs (px-3 py-2.5 rounded-none) -> rounded-xl
  code = code.replace(/px-3 py-2\.5 text-xs font-semibold focus:ring-1 focus:ring-indigo-600 transition-all/g, 'px-3 py-2.5 text-xs font-semibold rounded-xl focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all shadow-inner');
  
  // 8. Roster cards (bg-white rounded-none border border-slate-50 p-3) -> rounded-2xl shadow-sm
  code = code.replace(/bg-white rounded-none border border-slate-50 p-3 relative/g, 'bg-white rounded-2xl border border-slate-100 p-4 relative shadow-sm');
  
  // 9. Buttons
  code = code.replace(/w-full bg-indigo-600 text-black py-4 rounded-none/g, 'w-full bg-indigo-600 text-white py-4 rounded-2xl');
  code = code.replace(/w-full py-3\.5 rounded-none/g, 'w-full py-3.5 rounded-xl');
  code = code.replace(/w-full py-2\.5 text-\[9px\] font-bold uppercase tracking-widest border transition-colors flex justify-center items-center gap-2/g, 'w-full py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-xl border transition-colors flex justify-center items-center gap-2');
  code = code.replace(/py-3 text-\[10px\] font-bold uppercase tracking-widest border transition-colors/g, 'py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all shadow-sm hover:shadow-md');
  code = code.replace(/px-6 bg-slate-800 text-slate-900 rounded-none/g, 'px-6 bg-slate-900 text-white rounded-xl shadow-md');
  code = code.replace(/flex items-center gap-2 px-3 py-2 bg-indigo-600 text-black rounded-none/g, 'flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl');
  code = code.replace(/h-14 rounded-none/g, 'h-14 rounded-xl');
  code = code.replace(/py-2 rounded-none/g, 'py-2 rounded-xl');
  code = code.replace(/py-3 rounded-none/g, 'py-3 rounded-xl');
  
  // 10. General catch-all for remaining rounded-none inside components (be careful)
  code = code.replace(/rounded-none/g, 'rounded-xl');
  
  fs.writeFileSync(path, code);
  console.log('UI Revamp Script executed.');
}
