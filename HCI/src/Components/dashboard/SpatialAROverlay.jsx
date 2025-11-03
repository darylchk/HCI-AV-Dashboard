import React from 'react';
import { AlertTriangle, ArrowDown } from 'lucide-react';

export default function SpatialAROverlay({ location }) {
  // Position based on hazard location
  const positionClasses = {
    left: 'left-1/4 -translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-1/4 translate-x-1/2'
  };

  return (
    <>
      {/* Spatial AR Hazard Indicator - Anchored to road position */}
      <div 
        className={`absolute top-1/3 ${positionClasses[location]} z-40 flex flex-col items-center gap-4`}
        style={{
          animation: 'hazardPulse 0.8s ease-in-out infinite'
        }}
      >
        {/* Flashing Red Arrow pointing down to hazard */}
        <div className="text-[#FF3B30] animate-bounce">
          <ArrowDown className="w-16 h-16 drop-shadow-2xl" strokeWidth={3} />
        </div>

        {/* Red Outline Box - Simulating AR spatial anchor */}
        <div 
          className="relative w-64 h-32 border-4 border-[#FF3B30] rounded-lg bg-red-500/20 backdrop-blur-sm flex items-center justify-center"
          style={{
            boxShadow: '0 0 40px rgba(255, 59, 48, 0.8), inset 0 0 20px rgba(255, 59, 48, 0.3)'
          }}
        >
          {/* Hazard Icon */}
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="w-12 h-12 text-[#FF3B30]" strokeWidth={3} />
            <div className="text-white font-bold text-xl tracking-wide">
              BLIND SPOT HAZARD
            </div>
            <div className="text-white/90 font-medium text-sm">
              Vehicle entering from {location.toUpperCase()}
            </div>
          </div>

          {/* Corner markers for AR effect */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#FF3B30]"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#FF3B30]"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#FF3B30]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#FF3B30]"></div>
        </div>

        {/* Distance indicator */}
        <div className="bg-[#FF3B30] text-white px-4 py-2 rounded-full font-bold text-lg shadow-xl">
          150m
        </div>
      </div>

      {/* Ambient red glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(255, 59, 48, 0.3) 0%, transparent 50%)',
          animation: 'glowPulse 1s ease-in-out infinite'
        }}
      ></div>

      <style jsx>{`
        @keyframes hazardPulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.85; transform: translateY(-5px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}