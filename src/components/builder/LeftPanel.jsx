import React, { useState, useEffect } from 'react';
import ModelViewer from './ModelViewer';
import { HiOutlineCamera, HiOutlineZoomIn, HiOutlineZoomOut, HiOutlineChevronDown, HiOutlineChevronRight, HiOutlineCube, HiOutlineX } from 'react-icons/hi';
import { VscFiles, VscMenu } from 'react-icons/vsc';

const ActivityBtn = ({ icon, label, onClick, active = false, isMobile = false }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center transition-all relative group cursor-pointer
      ${isMobile ? 'w-10 h-10 rounded-full bg-white  shadow-lg border border-slate-100' : 'w-12 h-12'}
      ${active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
    title={label}
  >
    <span className={isMobile ? 'text-lg' : 'text-xl'}>{icon}</span>
    {!isMobile && active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600 shadow-[2px_0_8px_rgba(37,99,235,0.4)]" />}
    {!isMobile && (
      <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-900 border border-slate-100 text-slate-900 text-[9px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-xl shadow-black/50">
         {label}
      </div>
    )}
  </button>
);

const LeftPanel = ({
  modelUrl,
  meshes,
  activeMesh,
  setActiveMesh,
  meshStates,
  onMeshesDetected,
  decals,
  selectedDecalId,
  setSelectedDecalId,
  updateDecal,
  removeDecal,
  globalPattern,
  materialFinish,
  lightingPreset,
  mouseFollow,
  isHUDVisible = true
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMeshesExpanded, setIsMeshesExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full relative bg-white overflow-hidden font-['Outfit']">
      
      {/* ── 0. MOBILE BACKDROP OVERLAY ── */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[55] animate-fade-up duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── 1. ACTIVITY BAR ── */}
      {!isMobile ? (
        <div className={`transition-all duration-500 ease-in-out z-40 flex flex-col items-center bg-white  border-r border-slate-100 flex-shrink-0 shadow-sm
          ${isHUDVisible ? 'w-12 h-full' : 'w-0 h-0 opacity-0 pointer-events-none'}`}
        >
          <ActivityBtn icon={<VscFiles size={20} />} label="Explorer" active={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className="h-px w-6 bg-white/10 my-2" />
          <ActivityBtn icon={<HiOutlineCamera size={20} />} label="Reset Camera" onClick={() => window.dispatchEvent(new CustomEvent('eay:resetCamera'))} />
          <ActivityBtn icon={<HiOutlineZoomIn size={20} />} label="Zoom In" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: -0.5 }))} />
          <ActivityBtn icon={<HiOutlineZoomOut size={20} />} label="Zoom Out" onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: 0.5 }))} />
        </div>
      ) : (
        <div className={`fixed top-20 left-4 z-50 flex flex-col gap-3 transition-all duration-500 ${isHUDVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ActivityBtn isMobile icon={<VscFiles size={18} />} label="Explorer" active={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <ActivityBtn isMobile icon={<HiOutlineCamera size={18} />} label="Reset" onClick={() => window.dispatchEvent(new CustomEvent('eay:resetCamera'))} />
        </div>
      )}

      {/* ── 2. SIDE BAR (Explorer Drawer) ── */}
      <div className={`transition-all duration-500 ease-in-out z-[60] flex flex-col bg-white  border-r border-slate-100 flex-shrink-0 overflow-hidden shadow-2xl
        ${isMobile ? 'fixed inset-y-0 left-0 shadow-2xl' : 'relative'}
        ${isHUDVisible && isSidebarOpen ? (isMobile ? 'w-64' : 'w-56') : 'w-0 opacity-0 pointer-events-none'}`}
      >
        <div className="h-12 md:h-10 px-5 flex items-center justify-between bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <span className="text-[10px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Explorer</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-slate-500 hover:text-slate-900 transition-colors p-2 md:p-1 hover:bg-slate-100 rounded-md"
          >
            {isMobile ? <HiOutlineX size={18} /> : <VscMenu size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar" data-lenis-prevent>
          <div className="mb-1">
            <button 
              onClick={() => setIsMeshesExpanded(!isMeshesExpanded)}
              className="w-full flex items-center gap-2 px-3 py-4 md:py-2 hover:bg-slate-100 transition-colors cursor-pointer group outline-none border-b border-slate-100 md:border-none"
            >
              {isMeshesExpanded ? <HiOutlineChevronDown size={14} className="text-slate-500 group-hover:text-slate-900" /> : <HiOutlineChevronRight size={14} className="text-slate-500 group-hover:text-slate-900" />}
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest group-hover:text-slate-900">Active Meshes</span>
            </button>

            {isMeshesExpanded && (
              <div className="flex flex-col animate-fade-up">
                {meshes.map((info, idx) => {
                  const isActive = activeMesh === info.id;
                  return (
                    <button
                      key={info.id}
                      onClick={() => {
                        setActiveMesh(info.id);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                      className={`group flex items-center gap-3 px-6 py-4 md:py-2.5 transition-all text-left relative outline-none border-b border-slate-100 md:border-none
                        ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                    >
                      <HiOutlineCube size={16} className={isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-400'} />
                      <div className="flex flex-col leading-tight overflow-hidden">
                        <span className={`text-[12px] md:text-[11px] font-medium truncate tracking-tight ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>{info.display}.obj</span>
                        <span className={`text-[8px] md:text-[8px] font-bold uppercase tracking-[0.2em] ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>Asset Group {String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600 " />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-3 md:py-3 bg-slate-50 border-t border-slate-100 flex-shrink-0">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse " />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">GPU Matrix Stable</span>
           </div>
        </div>
      </div>

      {/* ── 3. 3D VIEWPORT ── */}
      <div className="flex-1 relative bg-white overflow-hidden min-h-[400px] md:min-h-0">
        <ModelViewer
          modelUrl={modelUrl}
          meshStates={meshStates}
          onMeshesDetected={onMeshesDetected}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={setSelectedDecalId}
          updateDecal={updateDecal}
          removeDecal={removeDecal}
          globalPattern={globalPattern}
          materialFinish={materialFinish}
          lightingPreset={lightingPreset}
          mouseFollow={mouseFollow}
        />

        <div className={`absolute top-4 md:top-6 right-4 md:left-6 pointer-events-none select-none z-10 transition-all duration-500 
          ${isHUDVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5 py-2.5 bg-white  border border-slate-100 rounded-xl shadow-xl">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse " />
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Studio Mode</span>
              <span className="text-[10px] md:text-[10px] font-bold text-slate-900 uppercase tracking-widest">{meshes.length} Active Parts</span>
            </div>
          </div>
        </div>

        {isMobile && isHUDVisible && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-40 flex flex-col gap-3">
            <button onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: -0.5 }))} className="w-10 h-10 bg-white  shadow-2xl rounded-full flex items-center justify-center text-slate-900 border border-slate-100 active:scale-95 transition-transform"><HiOutlineZoomIn size={20} /></button>
            <button onClick={() => window.dispatchEvent(new CustomEvent('eay:zoom', { detail: 0.5 }))} className="w-10 h-10 bg-white  shadow-2xl rounded-full flex items-center justify-center text-slate-900 border border-slate-100 active:scale-95 transition-transform"><HiOutlineZoomOut size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
