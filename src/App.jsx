import React, { useEffect, useState, Suspense, lazy } from 'react';
import Navbar from './components/builder/Navbar';
import { designs } from './components/builder/data/designs';
import { useBuilder } from './context/BuilderContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const Builder = lazy(() => import('./components/builder/Builder'));
const LandingPage = lazy(() => import('./components/builder/LandingPage'));

export default function App() {
  const { state, actions } = useBuilder();
  const { selectedDesign, refreshKey, fromPage, ...builderState } = state;
  const availableDesigns = designs;

  // Simple client-side routing based on state or hash
  const [currentId, setCurrentId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('/builder/')) {
        setCurrentId(hash.replace('/builder/', ''));
      } else {
        setCurrentId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isBuilderView = !!currentId;

  // Load the correct design whenever the URL :id changes
  useEffect(() => {
    if (currentId) {
      const design = availableDesigns.find(d => d.id === currentId);
      if (design) {
        actions.setSelectedDesign(design);
      }
    }
  }, [currentId, actions, availableDesigns]);

  // Listen for custom model imports from the Navbar FILE menu
  useEffect(() => {
    const handleImport = (e) => {
      const url = e.detail;
      const customDesign = {
        id: 'custom-' + Date.now(),
        name: 'Imported Model',
        modelUrl: url,
        thumbnail: '',
        mapping: {
          'Body': 'primary', 'Front': 'primary', 'Back': 'primary',
          'R_Sleeve': 'secondary', 'L_Sleeve': 'secondary', 'Neck': 'third'
        }
      };
      actions.setSelectedDesign(customDesign);
      window.location.hash = `#/builder/${customDesign.id}`;
    };
    window.addEventListener('eay:importModel', handleImport);
    return () => window.removeEventListener('eay:importModel', handleImport);
  }, [actions]);

  const handleSelectDesign = (design) => {
    window.location.hash = `#/builder/${design.id}`;
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    actions.incrementRefreshKey();
    setTimeout(() => {
      setIsTransitioning(false);
      window.location.hash = '';
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-[100dvh] flex flex-col bg-white ${isBuilderView ? 'h-[100dvh] overflow-hidden' : ''}`}
    >
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">

        {/* ── GPU Clearing Transition Spinner ── */}
        {isTransitioning && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-white py-40"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearing GPU Context...</span>
            </div>
          </motion.div>
        )}

        {/* ── Landing Page ── */}
        {!isTransitioning && !isBuilderView && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col bg-gray-50"
          >
            <Navbar onBack={null} backTo={fromPage} isLandingPage={true} />
            <LandingPage 
              availableDesigns={availableDesigns}
              onSelectDesign={handleSelectDesign} 
            />
          </motion.div>
        )}

        {/* ── 3D Builder ── */}
        {!isTransitioning && isBuilderView && (
          <motion.div
            key={`builder-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
          >
            <Navbar onBack={handleBackToLanding} backTo={fromPage} />
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>Loading 3D Engine...</div>}>
                <Builder />
              </Suspense>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
