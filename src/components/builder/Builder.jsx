import React, { useEffect, useState, memo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { useBuilder } from '../../context/BuilderContext';
import OnboardingTour from '../ui/OnboardingTour';

const Builder = memo(() => {
  const { state, actions } = useBuilder();
  const [isHUDVisible, setIsHUDVisible] = useState(true);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // Checkout Form States
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('USA');
  const [isSubmitCheckingOut, setIsSubmitCheckingOut] = useState(false);

  // Mock Authentication for Standalone Version
  const isUserAuthenticated = true;
  const currentUser = { role: 'user', phone: '', address: '', city: '' };
  const isDealer = currentUser?.role === 'dealer';

  const {
    selectedDesign: design,
    primaryColor, primaryIsGrad, primaryColor2,
    secondaryColor, secondaryIsGrad, secondaryColor2,
    thirdColor, thirdIsGrad, thirdColor2,
    globalPattern, lightingPreset, materialFinish, mouseFollow,
    meshes, activeMesh, meshStates, decals, selectedDecalId, roster
  } = state;

  const initialColors = {
    primary: { color: primaryColor, isGrad: primaryIsGrad, color2: primaryColor2 },
    secondary: { color: secondaryColor, isGrad: secondaryIsGrad, color2: secondaryColor2 },
    third: { color: thirdColor, isGrad: thirdIsGrad, color2: thirdColor2 }
  };

  useEffect(() => {
    const handleResetAll = () => {
      const resetStates = {};
      Object.keys(meshStates).forEach(meshId => {
        const m = meshes.find(mesh => mesh.id === meshId);
        if (m) {
          let type = 'Body';
          if (m.display.includes('Neck')) type = 'Neck';
          else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
          else if (m.display.includes('Front')) type = 'Front';
          else if (m.display.includes('Back')) type = 'Back';

          const colorKey = design.mapping[type] || design.mapping['Body'] || 'primary';
          const config = initialColors[colorKey];

          resetStates[meshId] = {
            color: config.color,
            isGrad: config.isGrad,
            grad1: config.color2,
            grad2: config.color,
            pColor: '#ffffff',
            pUrl: null
          };
        }
      });
      actions.updateMeshStates(resetStates);
      window.dispatchEvent(new CustomEvent('eay:resetCamera'));
    };

    const handleSave = () => {
      if (!isUserAuthenticated) {
        toast.error('Please sign in to save your custom design!', { icon: '🔐' })
        return
      }
      setSaveName(design.name || "My Custom Design");
      setSaveModalOpen(true);
    };

    const handleToggleHUD = () => {
      setIsHUDVisible(prev => !prev);
    };

    window.addEventListener('eay:resetAll', handleResetAll);
    window.addEventListener('eay:save', handleSave);
    window.addEventListener('eay:toggleHUD', handleToggleHUD);

    return () => {
      window.removeEventListener('eay:resetAll', handleResetAll);
      window.removeEventListener('eay:save', handleSave);
      window.removeEventListener('eay:toggleHUD', handleToggleHUD);
    };
  }, [actions, meshStates, meshes, design, initialColors, globalPattern, materialFinish, lightingPreset, isUserAuthenticated]);

  const handleMeshesDetected = useCallback((meshList) => {
    actions.setMeshes(meshList);
    if (meshList.length > 0 && !activeMesh) {
      actions.setActiveMesh(meshList[0].id);
    }

    const nextStates = {};
    meshList.forEach(m => {
      if (!meshStates[m.id]) {
        let type = 'Body';
        if (m.display.includes('Neck')) type = 'Neck';
        else if (m.display.includes('Sleeve')) type = m.display.includes('R') ? 'R_Sleeve' : 'L_Sleeve';
        else if (m.display.includes('Front')) type = 'Front';
        else if (m.display.includes('Back')) type = 'Back';

        const colorKey = design.mapping[type] || design.mapping['Body'] || 'primary';
        const config = initialColors[colorKey];

        nextStates[m.id] = {
          color: config.color,
          isGrad: config.isGrad,
          grad1: config.color2,
          grad2: config.color,
          pColor: '#ffffff',
          pUrl: null
        };
      }
    });

    if (Object.keys(nextStates).length > 0) {
      actions.updateMeshStates(nextStates);
    }
  }, [actions, activeMesh, design, initialColors, meshStates]);

  const confirmSave = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a valid name for your design.');
      return;
    }
    setSaveModalOpen(false);
    toast.success('Design saved successfully!', { icon: '🎨' });
    // In standalone, just show success toast.
  };

  const handleCheckoutClick = () => {
    if (!isUserAuthenticated) {
      toast.error('Please sign in to complete checkout!', { icon: '🔐' });
      return;
    }
    if (currentUser) {
      if (currentUser.phone) setContactPhone(currentUser.phone);
      if (currentUser.address) setShippingAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
    }
    setCheckoutModalOpen(true);
  };

  const confirmCheckout = (e) => {
    if (e) e.preventDefault();

    if (!shippingAddress.trim()) {
      toast.error('Please enter your shipping address.');
      return;
    }
    if (!contactPhone.trim()) {
      toast.error('Please enter your phone number.');
      return;
    }
    if (isDealer && !city.trim()) {
      toast.error('Please enter your city.');
      return;
    }

    setIsSubmitCheckingOut(true);
    const toastId = toast.loading('Processing order...');

    setTimeout(() => {
      setIsSubmitCheckingOut(false);
      toast.success('Order placed successfully! (Mock)', { id: toastId, icon: '🎉' });
      setCheckoutModalOpen(false);
      actions.setRoster([{ id: Date.now(), name: '', number: '', size: 'L' }]);
    }, 1500);
  };

  if (!design) return <div className="p-20 text-center font-bold text-slate-400">Loading Design...</div>;

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-white relative h-full min-h-0 overflow-hidden" style={{ minWidth: 0 }}>
      {/* ── Left Viewport & Component Dock ── */}
      <div className="flex-1 min-h-[350px] md:min-h-0 min-w-0 overflow-hidden">
        <LeftPanel
          key={design.id}
          modelUrl={design.modelUrl}
          meshes={meshes}
          activeMesh={activeMesh}
          setActiveMesh={(id) => actions.setActiveMesh(id)}
          meshStates={meshStates}
          onMeshesDetected={handleMeshesDetected}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={(id) => actions.setSelectedDecalId(id)}
          updateDecal={(id, updates) => actions.updateDecal(id, updates)}
          removeDecal={(id) => actions.removeDecal(id)}
          globalPattern={globalPattern}
          materialFinish={materialFinish}
          lightingPreset={lightingPreset}
          mouseFollow={mouseFollow}
          isHUDVisible={isHUDVisible}
        />
      </div>

      {/* ── Right Panel (Workstation) ── */}
      <div className={`transition-all duration-500 ease-in-out border-l border-slate-100 bg-white flex-shrink-0
        ${isHUDVisible ? 'w-full md:w-[420px] flex-1 md:flex-none md:h-full opacity-100' : 'w-0 h-0 opacity-0 translate-x-full overflow-hidden border-none'}`}>
        <RightPanel
          activeMesh={activeMesh}
          meshStates={meshStates}
          updateMeshProp={(meshId, prop, val) => actions.updateMeshProp(meshId, prop, val)}
          decals={decals}
          selectedDecalId={selectedDecalId}
          setSelectedDecalId={(id) => actions.setSelectedDecalId(id)}
          addDecal={(type, text, imageUrl) => actions.addDecal({ type, text, imageUrl })}
          updateDecal={(id, updates) => actions.updateDecal(id, updates)}
          removeDecal={(id) => actions.removeDecal(id)}
          globalPattern={globalPattern}
          setGlobalPattern={(val) => actions.setGlobalPattern(val)}
          lightingPreset={lightingPreset}
          setLightingPreset={(val) => actions.setLightingPreset(val)}
          materialFinish={materialFinish}
          setMaterialFinish={(val) => actions.setMaterialFinish(val)}
          mouseFollow={mouseFollow}
          setMouseFollow={(val) => actions.setMouseFollow(val)}
          roster={roster}
          setRoster={(val) => actions.setRoster(val)}
          onCheckout={handleCheckoutClick}
        />
      </div>

      {/* Cinematic View Helper */}
      {!isHUDVisible && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none fade-up flex flex-col items-center">
          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-[1em] mb-1">Cinematic Mode</span>
          <div className="w-12 h-0.5 bg-indigo-600/30" />
        </div>
      )}

      {/* Save Modal */}
      <AnimatePresence>
        {saveModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSaveModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden"
            >
              <div className="p-7">
                <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Save Custom Design</h3>
                <p className="text-sm text-slate-500 mb-6 font-medium">Enter a name for your design so you can easily find it later in your portfolio.</p>

                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g. Home Kit 2026"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all mb-8 font-medium text-slate-800"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmSave();
                    if (e.key === 'Escape') setSaveModalOpen(false);
                  }}
                />

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSave}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-[#4F46E5] text-white hover:bg-[#4338ca] shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                  >
                    Save to Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Roster Checkout Modal */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitCheckingOut && setCheckoutModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[201] overflow-hidden"
            >
              <form onSubmit={confirmCheckout} className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">Roster Checkout</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Complete your wholesale / customized order details below.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isSubmitCheckingOut}
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">

                  {/* Order Summary Summary */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={design.thumbnail || 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?w=600&h=400&fit=crop&q=80'}
                          alt="Custom design"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{design.name || 'Custom Jersey'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{roster.length} jerseys in roster</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Total</p>
                      <p className="text-sm font-extrabold text-indigo-600">${(roster.length * 59.00).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-address" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Shipping Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      rows="2.5"
                      required
                      placeholder="Street, City, State, ZIP..."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 text-sm"
                      disabled={isSubmitCheckingOut}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="checkout-phone" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="e.g. +1 555-123-4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 text-sm"
                      disabled={isSubmitCheckingOut}
                    />
                  </div>

                  {/* B2B Dealer Fields */}
                  {isDealer && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="checkout-city" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          required
                          placeholder="City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 text-sm"
                          disabled={isSubmitCheckingOut}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="checkout-country" className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          Country
                        </label>
                        <input
                          id="checkout-country"
                          type="text"
                          required
                          placeholder="Country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-800 text-sm"
                          disabled={isSubmitCheckingOut}
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method Badge */}
                  <div className="bg-emerald-50/50 border border-emerald-100/50 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-[10px] font-bold text-emerald-950 uppercase tracking-wide">Payment Option</h4>
                      <p className="text-[9px] text-emerald-700/80 font-semibold mt-0.5">Cash on Delivery (Standard)</p>
                    </div>
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black uppercase tracking-wider">COD</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-200 transition-colors"
                    disabled={isSubmitCheckingOut}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl transition-all disabled:opacity-50"
                    disabled={isSubmitCheckingOut}
                  >
                    {isSubmitCheckingOut ? 'Processing Order...' : `Place Order ($${((roster.length * 59.00) * 1.08).toFixed(2)})`}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <OnboardingTour run={state.runTour} onTourEnd={() => actions.setRunTour(false)} />
    </div>
  );
});

export default Builder;
