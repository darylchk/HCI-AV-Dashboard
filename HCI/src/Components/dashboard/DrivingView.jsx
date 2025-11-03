import React from 'react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';

export default function DrivingView() {
  const { currentMessage, avPosition: scenarioAvPosition, showingCamera } = useExperiment();

  // If showing camera view, display Jam.png
  if (showingCamera) {
    return (
      <div className="relative flex-1 bg-black overflow-hidden">
        <img 
          src="/src/Components/images/Jam.png"
          alt="Traffic Jam Live Feed"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE
        </div>
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
          KPE Tunnel - 1000m ahead
        </div>
      </div>
    );
  }

  // Determine AV car position based on message and scenario state
  const getAVPosition = () => {
    // Scenario 2: User-initiated lane change
    if (scenarioAvPosition) {
      return scenarioAvPosition; // 'beside-left' or 'behind'
    }
    
    // Scenario 1: AV-initiated overtake
    if (!currentMessage) return null;
    
    switch(currentMessage) {
      case 'acknowledged':
        return 'beside'; // AV beside user car (left)
      case 'overtaking':
        return 'beside'; // Still beside during overtake request
      case 'thankyou':
        return 'front'; // AV in front after merge
      case 'seesyou':
      case 'intention':
      case 'goahead':
        return scenarioAvPosition || 'beside-left'; // Use scenario position or default
      default:
        return null;
    }
  };

  const avPosition = getAVPosition();

  return (
    <div className="relative flex-1 bg-gradient-to-b from-gray-700 to-gray-800 overflow-hidden">
      {/* Simulated Road View with AR Perspective */}
      <div className="absolute inset-0 flex items-end justify-center">
        {/* Sky/Horizon */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-800 via-sky-600 to-gray-700"></div>
        
        {/* Road Surface - Full height */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-600/50 via-gray-700 to-gray-800">
          {/* Road lanes */}
          <div className="w-full h-full relative">
            {/* Left edge line (dashed yellow) */}
            <div 
              className="absolute left-[16.66%] top-0 bottom-0 w-1"
              style={{
                background: 'repeating-linear-gradient(to bottom, #FCD34D 0px, #FCD34D 30px, transparent 30px, transparent 60px)',
                animation: 'laneScroll 2s linear infinite',
                opacity: 0.7
              }}
            ></div>
            
            {/* Left lane line (solid white) */}
            <div 
              className="absolute left-1/3 top-0 bottom-0 w-1.5 bg-white"
              style={{ opacity: 0.6 }}
            ></div>
            
            {/* Center line (dashed yellow) */}
            <div 
              className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2"
              style={{
                background: 'repeating-linear-gradient(to bottom, #FCD34D 0px, #FCD34D 30px, transparent 30px, transparent 60px)',
                animation: 'laneScroll 2s linear infinite',
                opacity: 0.6
              }}
            ></div>
            
            {/* Right lane line (solid white) */}
            <div 
              className="absolute left-2/3 top-0 bottom-0 w-1.5 bg-white"
              style={{ opacity: 0.6 }}
            ></div>
            
            {/* Right edge line (dashed yellow) */}
            <div 
              className="absolute left-[83.33%] top-0 bottom-0 w-1"
              style={{
                background: 'repeating-linear-gradient(to bottom, #FCD34D 0px, #FCD34D 30px, transparent 30px, transparent 60px)',
                animation: 'laneScroll 2s linear infinite',
                opacity: 0.7
              }}
            ></div>
          </div>
        </div>

        {/* AR Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* AR Scanlines Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ffff 2px, #00ffff 4px)',
            animation: 'scanline 4s linear infinite'
          }}
        ></div>

        {/* Vehicle Container - Centered with AR styling */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          
          {/* AR Distance Markers */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs font-mono opacity-60">
            <div className="bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-cyan-400/30">
              50m
            </div>
          </div>
          
          {/* AV Car - Beside (Left) for Scenario 1 */}
          {avPosition === 'beside' && (
            <div 
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: '10%',
                top: '50%',
                width: '10vw',
                minWidth: '100px',
                transform: 'translateY(-50%)',
                animation: currentMessage === 'acknowledged' ? 'slideInFromBottom 1s ease-out' : 'none',
                filter: 'drop-shadow(0 0 10px rgba(248, 164, 6, 0.5))'
              }}
            >
              {/* AR Highlight Box - Slow Flash */}
              <div 
                className="absolute -inset-1 border-2 border-[#F8A406] rounded-lg"
                style={{
                  animation: 'avBoxFlash 2s ease-in-out infinite'
                }}
              ></div>
              <img 
                src="/src/Components/images/AV-Car-Model.png" 
                alt="AV Car"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
              <div className="text-center mt-2">
                <span className="bg-[#F8A406] text-[#2F2E2E] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  AV
                </span>
              </div>
            </div>
          )}

          {/* AV Car - Beside Left (Southwest) for Scenario 2 */}
          {avPosition === 'beside-left' && (
            <div 
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: '25%',
                top: '55%',
                width: '10vw',
                minWidth: '100px',
                transform: 'translateX(-50%) translateY(-50%)',
                animation: 'slideInFromBottom 1s ease-out',
                filter: 'drop-shadow(0 0 10px rgba(248, 164, 6, 0.5))'
              }}
            >
              {/* AR Highlight Box - Slow Flash */}
              <div 
                className="absolute -inset-1 border-2 border-[#F8A406] rounded-lg"
                style={{
                  animation: 'avBoxFlash 2s ease-in-out infinite'
                }}
              ></div>
              <img 
                src="/src/Components/images/AV-Car-Model.png" 
                alt="AV Car"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
              <div className="text-center mt-2">
                <span className="bg-[#F8A406] text-[#2F2E2E] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  AV
                </span>
              </div>
            </div>
          )}

          {/* AV Car - Behind (For Scenario 2) */}
          {avPosition === 'behind' && (
            <div 
              className="absolute transition-all duration-1500 ease-in-out"
              style={{
                left: '50%',
                top: '72%',
                width: '8vw',
                minWidth: '80px',
                transform: 'translateX(-50%) translateY(-50%)',
                filter: 'drop-shadow(0 0 10px rgba(248, 164, 6, 0.5))'
              }}
            >
              {/* AR Highlight Box - Slow Flash */}
              <div 
                className="absolute -inset-1 border-2 border-[#F8A406] rounded-lg"
                style={{
                  animation: 'avBoxFlash 2s ease-in-out infinite'
                }}
              ></div>
              <img 
                src="/src/Components/images/AV-Car-Model.png" 
                alt="AV Car"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
              <div className="text-center mt-2">
                <span className="bg-[#F8A406] text-[#2F2E2E] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  AV
                </span>
              </div>
            </div>
          )}

          {/* AV Car - Front */}
          {avPosition === 'front' && (
            <div 
              className="absolute transition-all duration-1500 ease-in-out"
              style={{
                top: '30%',
                left: '50%',
                width: '11vw',
                minWidth: '110px',
                transform: 'translateX(-50%) translateY(-50%)',
                animation: 'moveToFront 1.5s ease-in-out',
                filter: 'drop-shadow(0 0 10px rgba(248, 164, 6, 0.5))'
              }}
            >
              {/* AR Highlight Box - Slow Flash */}
              <div 
                className="absolute -inset-1 border-2 border-[#F8A406] rounded-lg"
                style={{
                  animation: 'avBoxFlash 2s ease-in-out infinite'
                }}
              ></div>
              <img 
                src="/src/Components/images/AV-Car-Model.png" 
                alt="AV Car"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
              <div className="text-center mt-2">
                <span className="bg-[#F8A406] text-[#2F2E2E] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  AV
                </span>
              </div>
            </div>
          )}

          {/* User Car - Always Centered (ME) - No box */}
          <div 
            className="absolute" 
            style={{ 
              top: '50%', 
              left: '50%', 
              width: '18vw', 
              minWidth: '180px', 
              transform: 'translateX(-50%) translateY(-50%)'
            }}
          >
            <img 
              src="/src/Components/images/User-Car-Model.png" 
              alt="My Car"
              className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
            />
            <div className="text-center mt-2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ME
              </span>
            </div>
          </div>

          {/* Human Car (Red) - Right Lane - No AR box, no messages */}
          {/* Hide red car when AV is behind in Scenario 2 */}
          {avPosition !== 'behind' && (
            <div 
              className="absolute" 
              style={{ 
                top: '50%', 
                left: '83.33%', 
                width: '18vw', 
                minWidth: '180px', 
                transform: 'translateX(-50%) translateY(-50%)',
                animation: 'slideInFromBottom 1s ease-out'
              }}
            >
              <img 
                src="/src/Components/images/Human-Car-Model-Red.png" 
                alt="Human Driver"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          )}
        </div>

        {/* Speed and Status Overlay - AR Style */}
        <div className="absolute bottom-8 left-8 text-[#F3F7FF]">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-cyan-400/30">
            <div className="text-6xl font-bold text-cyan-400">63</div>
            <div className="text-sm opacity-70">mph</div>
          </div>
        </div>

        {/* V2V Status - AR Style */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-[#F3F7FF] text-sm flex items-center gap-2">
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            All Systems Operational
          </div>
        </div>

        {/* Range Indicator - AR Style */}
        <div className="absolute bottom-8 right-8 text-[#F3F7FF] text-sm">
          <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-cyan-400/30">
            Range: <span className="text-cyan-400 font-bold">250m</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes laneScroll {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        @keyframes avBoxFlash {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes slideInFromBottom {
          from {
            top: 100%;
            opacity: 0;
          }
          to {
            top: 50%;
            opacity: 1;
          }
        }
        @keyframes moveToFront {
          0% {
            top: 50%;
            left: 25%;
            transform: translateY(-50%) scale(1);
          }
          50% {
            top: 40%;
            left: 37.5%;
            transform: translateY(-50%) scale(1.05);
          }
          100% {
            top: 30%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}