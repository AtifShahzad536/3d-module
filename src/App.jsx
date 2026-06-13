import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { useBuilder } from './context/BuilderContext';
import { useModelImport } from './hooks/useModelImport';
import { designs } from './components/builder/data/designs';

import AppRoutes from './routes/AppRoutes';
import TransitionOverlay from './components/ui/TransitionOverlay';

export default function App() {
  const { actions } = useBuilder();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isBuilderView = location.pathname.startsWith('/builder');

  // Listen for custom model imports (from Navbar)
  useModelImport(actions);

  const handleSelectDesign = (design) => {
    navigate(`/builder/${design.id}`);
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    actions.incrementRefreshKey();
    setTimeout(() => {
      setIsTransitioning(false);
      navigate('/');
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-[100dvh] flex flex-col bg-white ${isBuilderView ? 'h-[100dvh] overflow-hidden' : ''}`}
    >
      <Toaster position="top-center" />
      
      <TransitionOverlay isVisible={isTransitioning} />

      <AppRoutes 
        availableDesigns={designs}
        onSelectDesign={handleSelectDesign}
        onBackToLanding={handleBackToLanding}
      />
    </motion.div>
  );
}
