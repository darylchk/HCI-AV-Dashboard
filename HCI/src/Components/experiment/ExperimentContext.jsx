import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ExperimentContext = createContext();

// Helper function to calculate speech duration
const getSpeechDuration = (text) => {
  // Average speaking rate is about 150 words per minute
  // At rate 0.9, it's about 135 words per minute
  const wordsPerMinute = 135;
  const words = text.split(' ').length;
  const durationMs = (words / wordsPerMinute) * 60 * 1000;
  // Add 500ms buffer
  return Math.max(durationMs + 500, 2000); // Minimum 2 seconds
};

// Speech text for each message type
const getSpeechText = (messageType) => {
  switch(messageType) {
    case 'acknowledged':
      return 'Acknowledged presence. Vehicle ABC-1234 sees you.';
    case 'overtaking':
      return 'Warning. Vehicle ABC-1234 wants to overtake from your left.';
    case 'thankyou':
      return 'Thank you. Merge complete.';
    case 'seesyou':
      return 'Vehicle ABC-1234 sees you.';
    case 'intention':
      return 'Acknowledged intention. Vehicle understands your lane change.';
    case 'goahead':
      return 'Go ahead. Safe to proceed with lane change.';
    case 'trafficjam':
      return 'Warning. Major Traffic Jam detected. 1000 meters ahead in KPE Tunnel. Would you like to view the live footage of the Jam?';
    case 'rightofway':
      return 'Right of way. Vehicle ABC-1234 is requesting your opinion. Would you like to go first?';
    case 'avmovesfirst':
      return 'A V will move first. Thank you for letting me go first.';
    default:
      return '';
  }
};

export function ExperimentProvider({ children }) {
  const [experimentState, setExperimentState] = useState({
    activeVersion: null, // 'spatial-ar' | 'standard-text' | null
    hazardActive: false,
    hazardLocation: 'left', // default to left side for AV scenario
    trialStartTime: null,
    showLocationModal: false,
    currentTrialId: null,
    currentMessage: null, // 'acknowledged' | 'overtaking' | 'thankyou' | 'intention' | 'goahead' | 'trafficjam' | 'rightofway' | 'avmovesfirst' | null
    messageHistory: [], // Array of message objects with timestamp
    waitingForMergeApproval: false,
    userLaneChangeRequested: false, // For Scenario 2
    avPosition: null, // 'beside-left' | 'behind' | null - for Scenario 2
    waitingForCameraApproval: false, // For Scenario 4
    showingCamera: false, // For Scenario 4 - when camera view is active
    waitingForRightOfWay: false, // For Scenario 5
    showCrossJunction: false, // For Scenario 5 - show cross junction view
    trafficLightMalfunction: false, // For Scenario 5 - flickering traffic light
  });

  // Sync state across tabs using localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'experimentState' && e.newValue) {
        console.log('State synced from another tab:', e.newValue);
        setExperimentState(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Load initial state from localStorage
    const savedState = localStorage.getItem('experimentState');
    if (savedState) {
      setExperimentState(JSON.parse(savedState));
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('experimentState', JSON.stringify(experimentState));
  }, [experimentState]);

  const triggerHazard = useCallback((version, location = 'right') => {
    const trialId = `trial_${Date.now()}`;
    setExperimentState({
      activeVersion: version,
      hazardActive: true,
      hazardLocation: location,
      trialStartTime: Date.now(),
      showLocationModal: false,
      currentTrialId: trialId
    });

    // Play audio alert
    const audio = new Audio('/assets/hazard-alert.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  }, []);

  const acknowledgeHazard = useCallback(() => {
    setExperimentState(prev => ({
      ...prev,
      hazardActive: false,
      showLocationModal: true
    }));
  }, []);

  const resetExperiment = useCallback(() => {
    setExperimentState({
      activeVersion: null,
      hazardActive: false,
      hazardLocation: 'left',
      trialStartTime: null,
      showLocationModal: false,
      currentTrialId: null,
      currentMessage: null,
      messageHistory: [],
      waitingForMergeApproval: false,
      userLaneChangeRequested: false,
      avPosition: null,
      waitingForCameraApproval: false,
      showingCamera: false,
      waitingForRightOfWay: false,
      showCrossJunction: false,
      trafficLightMalfunction: false,
    });
  }, []);

  const sendMessage = useCallback((messageType) => {
    const message = {
      type: messageType, // 'acknowledged' or 'overtaking'
      timestamp: Date.now(),
      vehicleId: 'ABC-1234'
    };

    setExperimentState(prev => ({
      ...prev,
      currentMessage: messageType,
      messageHistory: [...prev.messageHistory, message]
    }));
  }, []);

  const startAVOvertakeScenario = useCallback(() => {
    const trialId = `trial_${Date.now()}`;
    
    // Reset and start fresh
    setExperimentState({
      activeVersion: 'spatial-ar',
      hazardActive: false,
      hazardLocation: 'left',
      trialStartTime: Date.now(),
      showLocationModal: false,
      currentTrialId: trialId,
      currentMessage: null,
      messageHistory: [],
      waitingForMergeApproval: false,
    });

    // Step 1: Send "Acknowledged Presence" message immediately
    setTimeout(() => {
      const acknowledgedMsg = {
        type: 'acknowledged',
        timestamp: Date.now(),
        vehicleId: 'ABC-1234'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'acknowledged',
        messageHistory: [acknowledgedMsg]
      }));
    }, 500);

    // Step 2: After speech completes, send "Overtaking" message
    const acknowledgedDelay = getSpeechDuration(getSpeechText('acknowledged'));
    setTimeout(() => {
      const overtakingMsg = {
        type: 'overtaking',
        timestamp: Date.now(),
        vehicleId: 'ABC-1234'
      };
      setExperimentState(prev => ({
        ...prev,
        hazardActive: true,
        currentMessage: 'overtaking',
        messageHistory: [...prev.messageHistory, overtakingMsg],
        waitingForMergeApproval: true, // Wait for user to click "Allow Merge"
      }));

      // Play audio alert
      const audio = new Audio('/assets/hazard-alert.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }, 500 + acknowledgedDelay);
  }, []);

  const allowMerge = useCallback(() => {
    // User clicked "Allow Merge" - send thank you message
    const thankYouMsg = {
      type: 'thankyou',
      timestamp: Date.now(),
      vehicleId: 'ABC-1234'
    };
    
    setExperimentState(prev => ({
      ...prev,
      currentMessage: 'thankyou',
      hazardActive: false, // Hazard cleared after merge approval
      messageHistory: [...prev.messageHistory, thankYouMsg],
      waitingForMergeApproval: false,
    }));
  }, []);

  // Scenario 2: User Lane Change
  const startUserLaneChangeScenario = useCallback(() => {
    const trialId = `trial_${Date.now()}`;
    
    // Reset and start fresh with AV beside-left (southwest)
    setExperimentState({
      activeVersion: 'spatial-ar',
      hazardActive: false,
      hazardLocation: 'left',
      trialStartTime: Date.now(),
      showLocationModal: false,
      currentTrialId: trialId,
      currentMessage: null,
      messageHistory: [],
      waitingForMergeApproval: false,
      userLaneChangeRequested: false,
      avPosition: 'beside-left', // AV starts beside-left (southwest)
    });

    // AV sends "Sees You" message immediately
    setTimeout(() => {
      const seesYouMsg = {
        type: 'seesyou',
        timestamp: Date.now(),
        vehicleId: 'ABC-1234',
        direction: 'incoming'
      };

      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'seesyou',
        messageHistory: [seesYouMsg]
      }));
    }, 500);
  }, []);

  const simulateLaneChangeLeft = useCallback(() => {
    // User clicks button to initiate lane change (after seeing "Sees You")
    // Mark that user has initiated the lane change
    setExperimentState(prev => ({
      ...prev,
      userLaneChangeRequested: true
    }));

    // Step 1: AV responds with "Acknowledged Intention" after a delay
    const seesYouDelay = 1000; // Small delay after button click
    setTimeout(() => {
      const acknowledgedIntentionMsg = {
        type: 'intention',
        timestamp: Date.now(),
        vehicleId: 'ABC-1234',
        direction: 'incoming'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'intention',
        messageHistory: [...prev.messageHistory, acknowledgedIntentionMsg]
      }));
    }, seesYouDelay);

    // Step 2: AV responds with "Go Ahead" after intention speech completes
    const intentionDelay = getSpeechDuration(getSpeechText('intention'));
    setTimeout(() => {
      const goAheadMsg = {
        type: 'goahead',
        timestamp: Date.now(),
        vehicleId: 'ABC-1234',
        direction: 'incoming'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'goahead',
        messageHistory: [...prev.messageHistory, goAheadMsg],
        waitingForMergeApproval: true // Now waiting for user to acknowledge
      }));
    }, seesYouDelay + intentionDelay);
  }, []);

  const completeUserLaneChange = useCallback(() => {
    // User acknowledges "Go Ahead" and completes the overtake
    setExperimentState(prev => ({
      ...prev,
      waitingForMergeApproval: false,
      avPosition: 'behind' // AV moves behind
    }));
  }, []);

  // Scenario 4: KPE Traffic Jam Detection
  const startTrafficJamScenario = useCallback(() => {
    const trialId = `trial_${Date.now()}`;
    
    // Reset and start fresh
    setExperimentState({
      activeVersion: 'spatial-ar',
      hazardActive: false,
      hazardLocation: 'left',
      trialStartTime: Date.now(),
      showLocationModal: false,
      currentTrialId: trialId,
      currentMessage: null,
      messageHistory: [],
      waitingForMergeApproval: false,
      userLaneChangeRequested: false,
      avPosition: null,
      waitingForCameraApproval: false,
      showingCamera: false,
    });

    // Show traffic jam warning after 1 second
    setTimeout(() => {
      const trafficJamMsg = {
        type: 'trafficjam',
        timestamp: Date.now(),
        vehicleId: 'XYZ-1234W'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'trafficjam',
        messageHistory: [trafficJamMsg]
      }));
    }, 1000);

    // After speech completes, wait for camera approval
    const trafficJamDelay = getSpeechDuration(getSpeechText('trafficjam'));
    setTimeout(() => {
      // Add a new message for the camera question
      const cameraQuestionMsg = {
        type: 'cameraquestion',
        timestamp: Date.now(),
        vehicleId: 'XYZ-1234W'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'cameraquestion',
        messageHistory: [...prev.messageHistory, cameraQuestionMsg],
        waitingForCameraApproval: true
      }));
    }, 1000 + trafficJamDelay);
  }, []);

  const viewCameraFeed = useCallback(() => {
    // User approves to view camera
    setExperimentState(prev => ({
      ...prev,
      waitingForCameraApproval: false,
      showingCamera: true
    }));
  }, []);

  const declineCameraFeed = useCallback(() => {
    // User declines to view camera
    setExperimentState(prev => ({
      ...prev,
      waitingForCameraApproval: false
    }));
  }, []);

  // Scenario 5: Malfunctioning Traffic Light at Cross Junction
  const startMalfunctioningTrafficLightScenario = useCallback(() => {
    const trialId = `trial_${Date.now()}`;
    
    // Reset and start fresh with cross junction view
    setExperimentState({
      activeVersion: 'spatial-ar',
      hazardActive: false,
      hazardLocation: 'left',
      trialStartTime: Date.now(),
      showLocationModal: false,
      currentTrialId: trialId,
      currentMessage: null,
      messageHistory: [],
      waitingForMergeApproval: false,
      userLaneChangeRequested: false,
      avPosition: null,
      waitingForCameraApproval: false,
      showingCamera: false,
      waitingForRightOfWay: false,
      showCrossJunction: true,
      trafficLightMalfunction: true,
    });

    // Step 1: After 1 second, AV sends "Sees You" message
    setTimeout(() => {
      const seesYouMsg = {
        type: 'seesyou',
        timestamp: Date.now(),
        vehicleId: 'MYC 4224Y'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'seesyou',
        messageHistory: [seesYouMsg]
      }));
    }, 1000);

    // Step 2: After "Sees You" speech completes, send "Right of Way" request
    const seesYouDelay = getSpeechDuration(getSpeechText('seesyou'));
    setTimeout(() => {
      const rightOfWayMsg = {
        type: 'rightofway',
        timestamp: Date.now(),
        vehicleId: 'MYC 4224Y'
      };
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'rightofway',
        messageHistory: [...prev.messageHistory, rightOfWayMsg]
      }));
    }, 1000 + seesYouDelay);

    // Step 3: After "Right of Way" speech completes, wait for user decision
    const rightOfWayDelay = getSpeechDuration(getSpeechText('rightofway'));
    setTimeout(() => {
      setExperimentState(prev => ({
        ...prev,
        waitingForRightOfWay: true
      }));
    }, 1000 + seesYouDelay + rightOfWayDelay);
  }, []);

  const userGoesFirst = useCallback(() => {
    // User clicked "Yes" - they want to go first
    // AV sends "Acknowledged Intention" message
    const intentionMsg = {
      type: 'intention',
      timestamp: Date.now(),
      vehicleId: 'MYC 4224Y'
    };
    
    setExperimentState(prev => ({
      ...prev,
      currentMessage: 'intention',
      messageHistory: [...prev.messageHistory, intentionMsg],
      waitingForRightOfWay: false,
    }));

    // After speech completes, send "Go Ahead" message
    const intentionDelay = getSpeechDuration(getSpeechText('intention'));
    setTimeout(() => {
      const goAheadMsg = {
        type: 'goahead',
        timestamp: Date.now(),
        vehicleId: 'MYC 4224Y'
      };
      
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'goahead',
        messageHistory: [...prev.messageHistory, goAheadMsg],
        waitingForMergeApproval: true, // User can now proceed
      }));
    }, intentionDelay);
  }, []);

  const avGoesFirst = useCallback(() => {
    // User clicked "No" - AV will go first
    // AV sends "Acknowledged Intention" message
    const intentionMsg = {
      type: 'intention',
      timestamp: Date.now(),
      vehicleId: 'MYC 4224Y'
    };
    
    setExperimentState(prev => ({
      ...prev,
      currentMessage: 'intention',
      messageHistory: [...prev.messageHistory, intentionMsg],
      waitingForRightOfWay: false,
    }));

    // After speech completes, send "AV Moves First" message
    const intentionDelay = getSpeechDuration(getSpeechText('intention'));
    setTimeout(() => {
      const avMovesFirstMsg = {
        type: 'avmovesfirst',
        timestamp: Date.now(),
        vehicleId: 'MYC 4224Y'
      };
      
      setExperimentState(prev => ({
        ...prev,
        currentMessage: 'avmovesfirst',
        messageHistory: [...prev.messageHistory, avMovesFirstMsg],
      }));
    }, intentionDelay);
  }, []);

  const value = {
    ...experimentState,
    triggerHazard,
    acknowledgeHazard,
    resetExperiment,
    sendMessage,
    startAVOvertakeScenario,
    allowMerge,
    startUserLaneChangeScenario,
    simulateLaneChangeLeft,
    completeUserLaneChange,
    startTrafficJamScenario,
    viewCameraFeed,
    declineCameraFeed,
    startMalfunctioningTrafficLightScenario,
    userGoesFirst,
    avGoesFirst,
  };

  return (
    <ExperimentContext.Provider value={value}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within ExperimentProvider');
  }
  return context;
}