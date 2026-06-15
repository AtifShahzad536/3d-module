import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

const steps = [
  {
    target: '.tour-step-1',
    content: 'Welcome to Elite Studio! Here you can view your 3D apparel. You can left-click and drag to rotate, or scroll to zoom.',
    disableBeacon: true,
    placement: 'center',
  },
  {
    target: '.tour-step-2',
    content: 'The Left Panel contains your Explorer. Click the active parts to isolate and highlight specific meshes of the apparel.',
    placement: 'right',
  },
  {
    target: '.tour-step-3',
    content: 'The Right Panel is your customization hub! Here you can change colors, add custom names, numbers, and upload your own logos.',
    placement: 'left',
  },
  {
    target: '.tour-step-4',
    content: 'Need a custom model? Use the File menu to import your own .obj files.',
    placement: 'bottom',
  },
  {
    target: '.tour-step-5',
    content: 'When you are ready, you can export your final design for manufacturing. Have fun building!',
    placement: 'bottom',
  }
];

const OnboardingTour = ({ run, onTourEnd }) => {
  const [key, setKey] = useState(0);
  useEffect(() => {
    if (run) {
      setKey(prev => prev + 1); // Force reset when triggered
    }
  }, [run]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      onTourEnd();
    }
  };

  return (
    <Joyride
      key={key}
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#4f46e5', // Indigo-600
          textColor: '#1e293b', // Slate-800
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltipContainer: {
          textAlign: 'left',
          fontFamily: 'Outfit, sans-serif',
        },
        buttonNext: {
          backgroundColor: '#4f46e5',
          borderRadius: '6px',
        },
        buttonBack: {
          marginRight: '10px',
        },
      }}
    />
  );
};

export default OnboardingTour;
