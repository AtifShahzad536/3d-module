import React, { lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/builder/Navbar';
import BuilderRoute from '../components/builder/BuilderRoute';
import { useBuilder } from '../context/BuilderContext';

const LandingPage = lazy(() => import('../components/builder/LandingPage'));

const AppRoutes = ({ availableDesigns, onSelectDesign, onBackToLanding }) => {
  const location = useLocation();
  const { state } = useBuilder();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col bg-gray-50"
          >
            <Navbar onBack={null} backTo={state.fromPage} isLandingPage={true} />
            <LandingPage 
              availableDesigns={availableDesigns}
              onSelectDesign={onSelectDesign} 
            />
          </motion.div>
        } />

        <Route path="/builder/:id" element={
          <motion.div
            key={`builder-${state.refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-full absolute inset-0"
          >
            <BuilderRoute 
              availableDesigns={availableDesigns} 
              onBack={onBackToLanding} 
            />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
