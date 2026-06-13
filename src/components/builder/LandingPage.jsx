import React, { useState } from 'react';
import DesignPreview from './DesignPreview';
import { useBuilder } from '../../context/BuilderContext';
import { HiArrowRight, HiOutlineLightningBolt, HiOutlineColorSwatch, HiOutlineSparkles, HiOutlineCursorClick, HiOutlineCube, HiOutlineAdjustments } from 'react-icons/hi';
import { VscSymbolColor } from 'react-icons/vsc';

// Reusing colors from original LandingPage
const PRESET_COLORS = [
  '#ffffff', '#000000', '#c0c0c0', '#555555', 
  '#002080', '#1a56db', '#00b0f0', '#009688', 
  '#228b22', '#4caf50', '#ccff00', '#ffd700', 
  '#ff9800', '#e00000', '#990000', '#cc00cc',
  '#6236ff', '#ff4081', '#ffb6c1', '#8b4513'
];

const PATTERN_LIBRARY = [
  { id: 'camo', url: '/models/patterns/camo.jpg', label: 'CAMO' },
  { id: 'carbon', url: '/models/patterns/carbon.jpg', label: 'CARBON' },
  { id: 'hex', url: '/models/patterns/hex.jpg', label: 'HEXAGON' },
  { id: 'zebra', url: '/models/patterns/zebra.jpg', label: 'ZEBRA' }
];

const ColorRow = ({ label, colorState, isGrad, setColor, setGrad, color2State, setColor2 }) => (
  <div className="mb-4 bg-white border border-slate-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex gap-2">
         <button onClick={() => setGrad(false)} className={`px-2 py-1 text-[8px] font-bold tracking-widest border transition-colors ${!isGrad ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-400'}`}>SOLID</button>
         <button onClick={() => setGrad(true)} className={`px-2 py-1 text-[8px] font-bold tracking-widest border transition-colors ${isGrad ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-400'}`}>GRADIENT</button>
      </div>
    </div>
    
    {isGrad && (
      <div className="h-6 w-full mb-3 border border-slate-200" style={{ background: `linear-gradient(to right, ${colorState}, ${color2State})` }} />
    )}
    
    <div className="flex gap-2 mb-2">
       {isGrad && <div className="text-[8px] font-bold text-slate-400 w-12 pt-1 flex-shrink-0">COLOR 1</div>}
       <div className="flex flex-wrap gap-1.5 flex-1">
         {PRESET_COLORS.map(c => (
           <button key={c} onClick={() => setColor(c)} className={`w-5 h-5 border transition-all ${colorState === c ? 'border-indigo-600 scale-110 shadow-md z-10' : 'border-slate-200 hover:border-slate-400'}`} style={{ backgroundColor: c }} />
         ))}
       </div>
    </div>

    {isGrad && (
      <div className="flex gap-2 pt-2 border-t border-slate-50">
        <div className="text-[8px] font-bold text-slate-400 w-12 pt-1 flex-shrink-0">COLOR 2</div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          {PRESET_COLORS.map(c => (
            <button key={c} onClick={() => setColor2(c)} className={`w-5 h-5 border transition-all ${color2State === c ? 'border-indigo-600 scale-110 shadow-md z-10' : 'border-slate-200 hover:border-slate-400'}`} style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const LandingPage = ({ availableDesigns, onSelectDesign }) => {
  const { state, actions } = useBuilder();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex-1 w-full min-h-0 bg-slate-50 text-slate-900 font-['Outfit'] relative flex flex-col md:flex-row overflow-hidden">
      
      {/* Mobile Backdrop */}
      {showSettings && (
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden transition-opacity"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* ── LEFT SIDEBAR (SETTINGS) ── */}
      <div className={`
        absolute inset-y-0 left-0 z-[100] transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex-shrink-0 md:z-20
        w-[85vw] sm:w-[350px] md:w-[350px] lg:w-[400px]
        bg-white border-r border-slate-200 overflow-y-auto h-full shadow-2xl md:shadow-lg custom-scrollbar
        ${showSettings ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setShowSettings(false)}
          className="md:hidden absolute top-4 right-4 p-2 bg-slate-100 text-slate-600 rounded-full z-[110]"
        >
          ✕
        </button>
        
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-indigo-50 to-transparent">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 leading-none mb-2">
            Elite <span className="text-indigo-600">Configurator</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Studio Customization Panel
          </p>
        </div>

        <div className="p-6 space-y-8">
          
          {/* STUDIO CONSOLE */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineAdjustments className="text-indigo-600 text-lg" />
              <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Studio Console</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Environment Lighting</span>
                <div className="grid grid-cols-3 gap-2">
                  {['city', 'studio', 'night'].map(l => (
                    <button key={l} onClick={() => actions.setLightingPreset(l)} className={`py-2 text-[9px] font-bold uppercase tracking-widest border transition-colors ${state.lightingPreset === l ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Material Finish</span>
                <div className="grid grid-cols-3 gap-2">
                  {['matte', 'gloss', 'metallic'].map(f => (
                    <button key={f} onClick={() => actions.setMaterialFinish(f)} className={`py-2 text-[9px] font-bold uppercase tracking-widest border transition-colors ${state.materialFinish === f ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{f}</button>
                  ))}
                </div>
              </div>

              <div>
                <button onClick={() => actions.setMouseFollow(!state.mouseFollow)} className={`w-full py-2.5 text-[9px] font-bold uppercase tracking-widest border transition-colors flex justify-center items-center gap-2 ${state.mouseFollow ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  <HiOutlineCursorClick className="text-sm" /> 360 Mouse Follow: {state.mouseFollow ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* GLOBAL PATTERN OVERLAY */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="text-indigo-600 text-lg" />
              <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Global Pattern Overlay</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => actions.setGlobalPattern(null)} className={`py-3 text-[10px] font-bold uppercase tracking-widest border transition-colors ${!state.globalPattern ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>NO PATTERN</button>
              {PATTERN_LIBRARY.map(p => (
                <button key={p.id} onClick={() => actions.setGlobalPattern(p.url)} className={`py-3 text-[10px] font-bold uppercase tracking-widest border transition-colors ${state.globalPattern === p.url ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{p.label}</button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />

          {/* MATERIAL PALETTE */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <VscSymbolColor className="text-indigo-600 text-lg" />
              <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Material Palette</h2>
            </div>
            
            <ColorRow label="Primary Color" colorState={state.primaryColor} isGrad={state.primaryIsGrad} setColor={actions.setPrimaryColor} setGrad={actions.setPrimaryIsGrad} color2State={state.primaryColor2} setColor2={actions.setPrimaryColor2} />
            <ColorRow label="Secondary Color" colorState={state.secondaryColor} isGrad={state.secondaryIsGrad} setColor={actions.setSecondaryColor} setGrad={actions.setSecondaryIsGrad} color2State={state.secondaryColor2} setColor2={actions.setSecondaryColor2} />
            <ColorRow label="Technical Color" colorState={state.thirdColor} isGrad={state.thirdIsGrad} setColor={actions.setThirdColor} setGrad={actions.setThirdIsGrad} color2State={state.thirdColor2} setColor2={actions.setThirdColor2} />
          </div>

        </div>
      </div>

      {/* ── RIGHT CONTENT (GALLERY) ── */}
      <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar relative flex flex-col">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <span className="font-black text-slate-900 uppercase tracking-tight text-lg">Elite Studio</span>
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 border border-indigo-100 rounded-md text-[10px] font-bold uppercase tracking-widest active:bg-indigo-100 transition-colors"
          >
            <HiOutlineAdjustments className="text-sm" /> Settings
          </button>
        </div>

        <div className="p-4 md:p-12 lg:p-16 flex-1">
          
          <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                Design Gallery
              </h2>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Select a base model to begin</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 border border-indigo-100 uppercase tracking-widest">
              {availableDesigns.length} Models
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {availableDesigns.map((design) => (
              <div 
                key={design.id} 
                className="group flex flex-col gap-4 cursor-pointer"
                onClick={() => onSelectDesign(design)}
              >
                <div className="aspect-[4/5] relative bg-white rounded-none border border-slate-200 transition-all duration-500 overflow-hidden group-hover:-translate-y-2 group-hover:border-indigo-300 group-hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)] shadow-sm">
                  
                  <DesignPreview
                    modelUrl={design.modelUrl} 
                    mapping={design.mapping}
                    primaryColor={state.primaryColor} 
                    primaryIsGrad={state.primaryIsGrad} 
                    primaryColor2={state.primaryColor2}
                    secondaryColor={state.secondaryColor} 
                    secondaryIsGrad={state.secondaryIsGrad} 
                    secondaryColor2={state.secondaryColor2}
                    thirdColor={state.thirdColor} 
                    thirdIsGrad={state.thirdIsGrad} 
                    thirdColor2={state.thirdColor2}
                    pattern={state.globalPattern} 
                    lighting={state.lightingPreset} 
                    finish={state.materialFinish} 
                    mouseFollow={state.mouseFollow}
                  />

                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{design.id}</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 w-3/4">
                    <div className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 shadow-[0_10px_20px_rgba(37,99,235,0.3)] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-indigo-700">
                      Customize <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 px-1 text-center">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">
                    {design.name.split(' / ')[0]}
                  </h3>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {design.name.split(' / ')[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default LandingPage;
