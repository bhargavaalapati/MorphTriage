import { useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function TourGuide() {
  const [run, setRun] = useState(() => {
    return localStorage.getItem('morphTourDone') !== 'true';
  });

  const handleJoyrideCallback = (data) => {
    // This will print to your console so you can see EXACTLY what event fires!
    console.log("🚨 Joyride Event:", data); 
    
    const { status, action, type } = data;
    
    // Aggressively catch FINISHED, SKIPPED, manual 'close', or the V3 'tour:end'
    if (
      status === STATUS.FINISHED || 
      status === STATUS.SKIPPED || 
      action === 'close' || 
      type === 'tour:end'
    ) {
      console.log("✅ Tour complete. Locking it in Local Storage.");
      localStorage.setItem('morphTourDone', 'true');
      setRun(false);
    }
  };

  const steps = [
    {
      target: '.tour-header',
      content: 'Welcome to MorphTriage. This AI-powered assistive layer mutates based on cognitive load and bandwidth.',
      disableBeacon: true, 
      buttons: ['skip', 'primary']
    },
    {
      target: '.tour-input',
      content: 'Type a frantic emergency (e.g., "water rising fast") or a calm observation.',
      disableBeacon: true, 
      buttons: ['skip', 'back', 'primary']
    },
    {
      target: '.tour-toggle',
      content: 'Hit this to simulate a total cell network collapse.',
      disableBeacon: true, 
      buttons: ['back', 'primary']
    }
  ];

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      onEvent={handleJoyrideCallback}
      locale={{ skip: 'SKIP TOUR', last: 'FINISH' }}
      styles={{
        options: {
          primaryColor: '#3b82f6', 
          backgroundColor: '#1e293b', 
          textColor: '#f8fafc',
          overlayColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10000,
        },
        beaconInner: {
          backgroundColor: '#3b82f6'
        },
        beaconOuter: {
          border: '2px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.3)'
        },
        buttonSkip: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          fontWeight: '900',
          borderRadius: '8px',
          padding: '8px 16px',
          textTransform: 'uppercase'
        },
        buttonNext: {
          fontWeight: '900',
          borderRadius: '8px',
          textTransform: 'uppercase'
        }
      }}
    />
  );
}