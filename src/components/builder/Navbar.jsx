import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineFolderOpen, HiOutlineSaveAs, HiOutlineDownload, HiOutlineCubeTransparent, HiOutlineArrowLeft } from 'react-icons/hi';
import { VscHistory, VscEdit } from 'react-icons/vsc';
import { useBuilder } from '../../context/BuilderContext';

const Navbar = ({ onBack, backTo, isLandingPage }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const barRef = useRef(null);
  const { actions } = useBuilder();

  useEffect(() => {
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  let menuData = [
    {
      label: 'File',
      items: [
        {
          label: 'Import Model (.glb)', icon: <HiOutlineCubeTransparent />, action: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.glb,.gltf';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                window.dispatchEvent(new CustomEvent('eay:importModel', { detail: url }));
              }
            };
            input.click();
          }
        },
        { label: 'Save Design', icon: <HiOutlineSaveAs />, action: () => window.dispatchEvent(new CustomEvent('eay:save')) },
        { label: 'Export PNG', icon: <HiOutlineDownload />, action: () => window.dispatchEvent(new CustomEvent('eay:export')) },
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Reset All Colors', icon: <VscHistory />, action: () => window.dispatchEvent(new CustomEvent('eay:resetAll')) },
      ]
    },
    {
        label: 'View',
        items: [
          { label: 'Toggle HUD', action: () => window.dispatchEvent(new CustomEvent('eay:toggleHUD')) },
        ]
    },
    {
        label: 'Help',
        items: [
          { label: 'Guided Tour', action: () => actions?.setRunTour(true) },
        ]
    }
  ];

  if (isLandingPage) {
    menuData = menuData.filter(m => m.label !== 'File' && m.label !== 'View' && m.label !== 'Help');
  }

  // Helper to determine where the Exit button should go
  const handleExit = () => {
    const persistedFrom = sessionStorage.getItem('builder_from_page');
    if (persistedFrom === '/dealer/designs') {
      // Clear storage after exit to prevent sticky redirects in other sessions
      sessionStorage.removeItem('builder_from_page');
      window.location.href = '/dealer/designs';
      return;
    }

    if (onBack) {
      onBack();
    } else {
      window.location.href = backTo || '/';
    }
  };

  return (
    <div
      ref={barRef}
      className="w-full h-10 bg-white border-b border-slate-100 flex items-stretch select-none z-[70] flex-shrink-0 relative shadow-md shadow-slate-200"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Navigation / Exit Logic ── */}
      <div className="flex items-stretch border-r border-slate-100">
         <button 
           onClick={handleExit}
           className="px-5 flex items-center gap-2 hover:bg-slate-50 transition-colors border-r border-slate-100 group"
           title={onBack ? "Return to Library" : "Exit to Store"}
         >
            <HiOutlineArrowLeft className="text-slate-500 group-hover:text-[#00e5ff] transition-colors" size={14} />
            <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-widest transition-colors">Exit</span>
         </button>
      </div>

      {/* ── VS Code Style Logo & Branding ── */}
      <div className="flex items-center px-5 gap-3 border-r border-slate-100 bg-gradient-to-r from-indigo-50 to-transparent">
        <div className="flex items-center gap-2.5">
           <a href="/" className="w-5 h-5 bg-indigo-600 flex items-center justify-center rounded-sm hover:scale-105 transition-transform flex-shrink-0 shadow-md">
             <span className="text-white font-black text-[10px]">E</span>
           </a>
           <span className="hidden sm:inline text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] whitespace-nowrap">
             Elite <span className="text-indigo-600 ">Studio</span>
           </span>
        </div>
      </div>

      {/* ── Editor Menu Bar ── */}
      <div className="flex items-stretch flex-1">
        {menuData.map((menu) => (
          <div key={menu.label} className={`${menu.label === 'File' ? 'tour-step-4' : ''} relative flex items-stretch`}>
            <button
              className={`px-4 h-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors outline-none
                ${activeMenu === menu.label ? 'bg-slate-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
              onClick={() => setActiveMenu(prev => prev === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>

            {activeMenu === menu.label && (
              <div className="absolute top-full left-0 mt-0 w-max min-w-[240px] bg-white border border-slate-100 shadow-2xl shadow-black z-50 py-1.5 animate-fade-up rounded-b-md">
                {menu.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { item.action?.(); setActiveMenu(null); }}
                    className="w-full text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-[#00e5ff] hover:text-black flex items-center justify-between group transition-colors duration-150 uppercase tracking-widest"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <span className="text-sm opacity-60 group-hover:opacity-100">{item.icon}</span>}
                      <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                    <span className="text-[8px] opacity-40 group-hover:opacity-60 ml-8 tracking-tighter">
                       {menu.label === 'File' && i === 1 ? 'CTRL+S' : ''}
                       {menu.label === 'Edit' && i === 0 ? 'CTRL+R' : ''}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Active File / Project Name Indicator ── */}
      <div className="hidden md:flex flex-1 items-center justify-center pointer-events-none">
         <div className="px-4 py-1 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Context:</span>
            <span className="text-[9px] font-bold text-slate-800 uppercase tracking-widest">
               {window.location.pathname.includes('/builder/') ? 'Jersey_Library' : 'Studio_Entry'}
            </span>
         </div>
      </div>

      {/* ── System Status ── */}
      <div className="tour-step-5 ml-auto flex items-center gap-3 px-5 border-l border-slate-100">
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end leading-none">
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em]">Build</span>
            <span className="text-[9px] font-bold text-slate-600 tracking-widest">v2.0-DARK</span>
          </div>
          {!isLandingPage && (
            <button 
              onClick={() => actions?.setRunTour(true)}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest ">Tour</span>
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse " />
            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest ">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
