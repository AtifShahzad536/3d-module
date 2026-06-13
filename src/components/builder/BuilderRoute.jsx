import React, { useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBuilder } from '../../context/BuilderContext';
import Navbar from './Navbar';

const Builder = lazy(() => import('./Builder'));

const BuilderRoute = ({ availableDesigns, onBack }) => {
  const { id } = useParams();
  const { state, actions } = useBuilder();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const design = availableDesigns.find(d => d.id === id);
      if (design) {
        actions.setSelectedDesign(design);
      } else if (!id.startsWith('custom-')) {
        navigate('/');
      }
    }
  }, [id, actions, availableDesigns, navigate]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-full absolute inset-0">
      <Navbar onBack={onBack} backTo={state.fromPage} />
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>Loading 3D Engine...</div>}>
          <Builder />
        </Suspense>
      </div>
    </div>
  );
};

export default BuilderRoute;
