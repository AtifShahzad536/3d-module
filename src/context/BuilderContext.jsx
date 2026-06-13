import React, { createContext, useContext, useReducer, useCallback } from 'react';

const initialState = {
  view: 'landing', // 'landing', 'builder', 'transition'
  selectedDesign: null,
  fromPage: null,
  
  // Base Colors (mapped to meshes)
  primaryColor: '#ffffff',
  primaryIsGrad: false,
  primaryColor2: '#ffffff',
  
  secondaryColor: '#ffffff',
  secondaryIsGrad: false,
  secondaryColor2: '#ffffff',
  
  thirdColor: '#ffffff',
  thirdIsGrad: false,
  thirdColor2: '#ffffff',
  
  // Global Configs
  globalPattern: null,
  lightingPreset: 'city',
  materialFinish: 'matte',
  mouseFollow: false,
  
  // Model Specifics
  meshes: [],
  activeMesh: null,
  meshStates: {},
  decals: [],
  selectedDecalId: null,
  roster: [{ id: Date.now(), name: '', number: '', size: 'L' }],
  
  refreshKey: 0,
};

function builderReducer(state, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SELECTED_DESIGN':
      return {
        ...initialState,
        view: state.view,
        fromPage: state.fromPage,
        refreshKey: state.refreshKey,
        selectedDesign: action.payload,
        roster: [{ id: Date.now(), name: '', number: '', size: 'L' }]
      };
    case 'SET_PRIMARY_COLOR':
      return { ...state, primaryColor: action.payload };
    case 'SET_PRIMARY_IS_GRAD':
      return { ...state, primaryIsGrad: action.payload };
    case 'SET_PRIMARY_COLOR2':
      return { ...state, primaryColor2: action.payload };
    case 'SET_SECONDARY_COLOR':
      return { ...state, secondaryColor: action.payload };
    case 'SET_SECONDARY_IS_GRAD':
      return { ...state, secondaryIsGrad: action.payload };
    case 'SET_SECONDARY_COLOR2':
      return { ...state, secondaryColor2: action.payload };
    case 'SET_THIRD_COLOR':
      return { ...state, thirdColor: action.payload };
    case 'SET_THIRD_IS_GRAD':
      return { ...state, thirdIsGrad: action.payload };
    case 'SET_THIRD_COLOR2':
      return { ...state, thirdColor2: action.payload };
    case 'SET_GLOBAL_PATTERN':
      return { ...state, globalPattern: action.payload };
    case 'SET_LIGHTING_PRESET':
      return { ...state, lightingPreset: action.payload };
    case 'SET_MATERIAL_FINISH':
      return { ...state, materialFinish: action.payload };
    case 'SET_MOUSE_FOLLOW':
      return { ...state, mouseFollow: action.payload };
    case 'SET_MESHES':
      return { ...state, meshes: action.payload };
    case 'SET_ACTIVE_MESH':
      return { ...state, activeMesh: action.payload };
    case 'UPDATE_MESH_STATES':
      return { ...state, meshStates: { ...state.meshStates, ...action.payload } };
    case 'UPDATE_MESH_PROP':
      if (state.meshStates[action.payload.meshId]) {
        return {
          ...state,
          meshStates: {
            ...state.meshStates,
            [action.payload.meshId]: {
              ...state.meshStates[action.payload.meshId],
              [action.payload.prop]: action.payload.val
            }
          }
        };
      }
      return state;
    case 'ADD_DECAL': {
      const decal = action.payload;
      const newDecal = {
        id: Date.now().toString(),
        type: decal.type || 'text',
        text: decal.text || 'TEXT',
        imageUrl: decal.imageUrl || null,
        color: '#ffffff',
        font: 'Outfit',
        decalScale: decal.type === 'image' ? 0.12 : decal.type === 'pattern' ? 0.8 : 0.15,
        decalScaleX: decal.type === 'image' ? 0.12 : decal.type === 'pattern' ? 0.8 : 0.15,
        decalScaleY: decal.type === 'image' ? 0.12 : decal.type === 'pattern' ? 0.8 : 0.15,
        pFadeTop: 0.0,
        pFadeBottom: 0.0,
        pFadeLeft: 0.0,
        pFadeRight: 0.0,
        pFadeTopLeft: 0.0,
        pFadeTopRight: 0.0,
        pFadeBottomLeft: 0.0,
        pFadeBottomRight: 0.0,
        ...decal
      };
      return {
        ...state,
        decals: [...state.decals, newDecal],
        selectedDecalId: newDecal.id
      };
    }
    case 'UPDATE_DECAL':
      return {
        ...state,
        decals: state.decals.map(d => d.id === action.payload.id ? { ...d, ...action.payload.updates } : d)
      };
    case 'REMOVE_DECAL':
      return {
        ...state,
        decals: state.decals.filter(d => d.id !== action.payload),
        selectedDecalId: state.selectedDecalId === action.payload ? null : state.selectedDecalId
      };
    case 'SET_SELECTED_DECAL_ID':
      return { ...state, selectedDecalId: action.payload };
    case 'SET_ROSTER':
      return { ...state, roster: action.payload };
    case 'SET_FROM_PAGE':
      return { ...state, fromPage: action.payload };
    case 'INCREMENT_REFRESH_KEY':
      return { ...state, refreshKey: state.refreshKey + 1 };
    case 'LOAD_SAVED_DESIGN_DATA':
      return {
        ...state,
        meshStates: action.payload.meshStates || state.meshStates,
        decals: action.payload.decals || state.decals,
        globalPattern: action.payload.globalPattern !== undefined ? action.payload.globalPattern : state.globalPattern,
        materialFinish: action.payload.materialFinish !== undefined ? action.payload.materialFinish : state.materialFinish,
        lightingPreset: action.payload.lightingPreset !== undefined ? action.payload.lightingPreset : state.lightingPreset
      };
    default:
      return state;
  }
}

const BuilderContext = createContext();

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  // Expose action creators wrapped in dispatch for convenience
  const actions = React.useMemo(() => ({
    setView: (view) => dispatch({ type: 'SET_VIEW', payload: view }),
    setSelectedDesign: (design) => dispatch({ type: 'SET_SELECTED_DESIGN', payload: design }),
    setPrimaryColor: (color) => dispatch({ type: 'SET_PRIMARY_COLOR', payload: color }),
    setPrimaryIsGrad: (isGrad) => dispatch({ type: 'SET_PRIMARY_IS_GRAD', payload: isGrad }),
    setPrimaryColor2: (color) => dispatch({ type: 'SET_PRIMARY_COLOR2', payload: color }),
    setSecondaryColor: (color) => dispatch({ type: 'SET_SECONDARY_COLOR', payload: color }),
    setSecondaryIsGrad: (isGrad) => dispatch({ type: 'SET_SECONDARY_IS_GRAD', payload: isGrad }),
    setSecondaryColor2: (color) => dispatch({ type: 'SET_SECONDARY_COLOR2', payload: color }),
    setThirdColor: (color) => dispatch({ type: 'SET_THIRD_COLOR', payload: color }),
    setThirdIsGrad: (isGrad) => dispatch({ type: 'SET_THIRD_IS_GRAD', payload: isGrad }),
    setThirdColor2: (color) => dispatch({ type: 'SET_THIRD_COLOR2', payload: color }),
    setGlobalPattern: (pattern) => dispatch({ type: 'SET_GLOBAL_PATTERN', payload: pattern }),
    setLightingPreset: (preset) => dispatch({ type: 'SET_LIGHTING_PRESET', payload: preset }),
    setMaterialFinish: (finish) => dispatch({ type: 'SET_MATERIAL_FINISH', payload: finish }),
    setMouseFollow: (follow) => dispatch({ type: 'SET_MOUSE_FOLLOW', payload: follow }),
    setMeshes: (meshes) => dispatch({ type: 'SET_MESHES', payload: meshes }),
    setActiveMesh: (mesh) => dispatch({ type: 'SET_ACTIVE_MESH', payload: mesh }),
    updateMeshStates: (states) => dispatch({ type: 'UPDATE_MESH_STATES', payload: states }),
    updateMeshProp: (meshId, prop, val) => dispatch({ type: 'UPDATE_MESH_PROP', payload: { meshId, prop, val } }),
    addDecal: (decal) => dispatch({ type: 'ADD_DECAL', payload: decal }),
    updateDecal: (id, updates) => dispatch({ type: 'UPDATE_DECAL', payload: { id, updates } }),
    removeDecal: (id) => dispatch({ type: 'REMOVE_DECAL', payload: id }),
    setSelectedDecalId: (id) => dispatch({ type: 'SET_SELECTED_DECAL_ID', payload: id }),
    setRoster: (roster) => dispatch({ type: 'SET_ROSTER', payload: roster }),
    setFromPage: (page) => dispatch({ type: 'SET_FROM_PAGE', payload: page }),
    incrementRefreshKey: () => dispatch({ type: 'INCREMENT_REFRESH_KEY' }),
    loadSavedDesignData: (data) => dispatch({ type: 'LOAD_SAVED_DESIGN_DATA', payload: data }),
  }), []);

  return (
    <BuilderContext.Provider value={{ state, actions }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
