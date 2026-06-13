import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useModelImport = (actions) => {
  const navigate = useNavigate();

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
      navigate(`/builder/${customDesign.id}`);
    };
    
    window.addEventListener('eay:importModel', handleImport);
    return () => window.removeEventListener('eay:importModel', handleImport);
  }, [actions, navigate]);
};
