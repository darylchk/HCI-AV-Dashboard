import React, { useState, useEffect, useRef } from 'react';
import { useExperiment } from '../Components/experiment/ExperimentContext.jsx';
import { AlertTriangle, ArrowRight, Eye, CheckCircle, Heart, ArrowLeft, ThumbsUp, Volume2, VolumeX, AlertOctagon } from 'lucide-react';

function OBUContent() {
  const { hazardActive, activeVersion, hazardLocation, currentMessage } = useExperiment();
  
  // Use currentMessage from context instead of local state
  const messageType = currentMessage || null; // No default, show time screen when null

  console.log('OBU - currentMessage:', currentMessage, 'messageType:', messageType); // Debug

  // Flash effect when message changes
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const previousMessageRef = useRef(null);
  
  // Text-to-speech function
  const speak = (text) => {
    if (!isSpeechEnabled) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    if (currentMessage && currentMessage !== previousMessageRef.current) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 500);
      
      // Speak the message
      let speechText = '';
      switch(currentMessage) {
        case 'acknowledged':
          speechText = 'Acknowledged presence. Vehicle ABC-1234 sees you.';
          break;
        case 'overtaking':
          speechText = 'Warning. Vehicle ABC-1234 wants to overtake from your left.';
          break;
        case 'thankyou':
          speechText = 'Thank you. Merge complete.';
          break;
        case 'seesyou':
          speechText = 'Vehicle ABC-1234 sees you.';
          break;
        case 'intention':
          speechText = 'Acknowledged intention. Vehicle understands your lane change.';
          break;
        case 'goahead':
          speechText = 'Go ahead. Safe to proceed with lane change.';
          break;
        case 'trafficjam':
          speechText = 'Warning. Major Traffic Jam detected. 1000 meters ahead in KPE Tunnel. Would you like to view the live footage of the Jam?';
          break;
        case 'rightofway':
          speechText = 'Right of way. Vehicle ABC-1234 is requesting your opinion. Would you like to go first?';
          break;
        case 'avmovesfirst':
          speechText = 'A V will move first. Thank you for letting me go first.';
          break;
      }
      
      if (speechText) {
        speak(speechText);
      }
      
      previousMessageRef.current = currentMessage;
      
      return () => clearTimeout(timer);
    }
  }, [currentMessage, isSpeechEnabled]);
  
  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Default screen - just show time
  if (!messageType) {
    return (
      <div className="h-screen bg-[#2F2E2E] flex flex-col items-center justify-center p-8 relative">
        {/* Debug Info */}
        <div className="absolute top-6 left-6 text-[#F3F7FF]/50 text-xs">
          Debug: {currentMessage || 'none'} | Hazard: {hazardActive ? 'yes' : 'no'}
        </div>
        
        {/* Speech Toggle Button */}
        <button
          onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
          className="absolute top-6 right-6 bg-[#1a1919] hover:bg-gray-700 text-[#F3F7FF] p-3 rounded-lg transition-all"
          title={isSpeechEnabled ? 'Disable speech' : 'Enable speech'}
        >
          {isSpeechEnabled ? <Volume2 className="w-6 h-6 text-green-400" /> : <VolumeX className="w-6 h-6 text-gray-500" />}
        </button>
        
        {/* Large Centered Time Display */}
        <div className="text-center">
          <div className="text-[#F3F7FF] text-8xl font-bold mb-4">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[#F3F7FF]/50 text-2xl">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-[#2F2E2E] flex flex-col items-center justify-center p-8 relative transition-all duration-300 ${
      isFlashing ? 'brightness-125' : 'brightness-100'
    }`}>
      {/* Debug Info */}
      <div className="absolute top-6 left-6 text-[#F3F7FF]/50 text-xs">
        Debug: {currentMessage || 'none'} | Hazard: {hazardActive ? 'yes' : 'no'}
      </div>
      
      {/* Speech Toggle Button */}
      <button
        onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
        className="absolute top-6 right-6 bg-[#1a1919] hover:bg-gray-700 text-[#F3F7FF] p-3 rounded-lg transition-all z-50"
        title={isSpeechEnabled ? 'Disable speech' : 'Enable speech'}
      >
        {isSpeechEnabled ? <Volume2 className="w-6 h-6 text-green-400" /> : <VolumeX className="w-6 h-6 text-gray-500" />}
      </button>
      
      {/* Time Display */}
      <div className="absolute bottom-6 right-8 text-[#F3F7FF]/50 text-sm">
        {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>

      {/* Main Content with slide-in animation */}
      <div key={messageType} className="max-w-lg w-full space-y-8 animate-slideIn">
        {/* Car Image - Use caution.png for traffic jam, otherwise use car model */}
        <div className="relative flex justify-center">
          <img 
            src={messageType === 'trafficjam' ? "/src/Components/images/caution.png" : "/src/Components/images/AV-Car-Model.png"}
            alt={messageType === 'trafficjam' ? "Caution" : "Vehicle"}
            className="w-64 h-auto object-contain"
          />
        </div>

        {/* Message Type Indicator - Changes based on messageType */}
        {messageType === 'overtaking' ? (
          <>
            {/* Overtaking Message */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Overtaking From: YOUR LEFT</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Wants to Overtake
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle requesting lane change
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'thankyou' ? (
          <>
            {/* Thank You Message */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <Heart className="w-6 h-6 fill-[#2F2E2E]" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Thank You!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Merge Complete
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Thank you for allowing the merge
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'seesyou' ? (
          <>
            {/* Sees You Message - Same format as Scenario 1 */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <Eye className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Sees You!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Sees You!
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle acknowledges your presence
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'intention' ? (
          <>
            {/* Acknowledged Intention Message */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <CheckCircle className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Acknowledged Intention!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Understands Your Intention
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle is aware of your lane change
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'goahead' ? (
          <>
            {/* Go Ahead Message */}
            <div className="flex justify-center">
              <div className="bg-[#34C759] border-2 border-[#34C759] text-white px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <ThumbsUp className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Go Ahead!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#34C759] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Approves Lane Change
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Safe to proceed with maneuver
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'trafficjam' ? (
          <>
            {/* Traffic Jam Warning Message */}
            <div className="flex justify-center">
              <div className="bg-red-600 border-2 border-red-600 text-white px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <AlertOctagon className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Traffic Jam Detected!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-red-500 font-black text-2xl tracking-wide animate-blink">
                  VEHICLE XYZ-1234W
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Warning: Major Traffic Jam
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  1000m ahead in KPE Tunnel
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'rightofway' ? (
          <>
            {/* Right of Way Request Message */}
            <div className="flex justify-center">
              <div className="bg-purple-600 border-2 border-purple-600 text-white px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <ArrowRight className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">Right of Way</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-purple-500 font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Would you like to go first?
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle is requesting your opinion
                </div>
              </div>
            </div>
          </>
        ) : messageType === 'avmovesfirst' ? (
          <>
            {/* AV Moves First Message */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <Heart className="w-6 h-6 fill-[#2F2E2E]" strokeWidth={3} />
                <span className="font-bold text-xl animate-blink">AV Will Move First</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide animate-blink">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Thank You
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle thanks you for letting them go first
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Acknowledged Presence Message */}
            <div className="flex justify-center">
              <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-8 py-3 rounded-lg shadow-lg inline-flex items-center gap-3">
                <CheckCircle className="w-6 h-6" strokeWidth={3} />
                <span className="font-bold text-xl">Acknowledged Presence!</span>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <div className="bg-[#1a1919] rounded-2xl p-6 shadow-2xl border border-gray-700">
              <div className="text-center space-y-3">
                <div className="text-[#F8A406] font-black text-2xl tracking-wide">
                  VEHICLE ABC-1234
                </div>
                <div className="text-[#F3F7FF] text-xl font-semibold">
                  Sees You!
                </div>
                <div className="text-[#F3F7FF]/70 text-base">
                  Vehicle Acknowledges your presence
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OBU() {
  return (
    <OBUContent />
  );
}