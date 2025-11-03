import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function StandardTextOverlay() {
  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">
      {/* Fixed Red Warning Box - Non-spatial */}
      <div 
        className="bg-[#FF3B30] border-4 border-red-700 rounded-xl px-8 py-6 shadow-2xl"
        style={{
          animation: 'warningFlash 1s ease-in-out infinite',
          boxShadow: '0 0 50px rgba(255, 59, 48, 0.9)'
        }}
      >
        <div className="flex items-center gap-4 text-white">
          <AlertTriangle className="w-10 h-10" strokeWidth={3} />
          <div>
            <div className="text-2xl font-bold tracking-wide">
              HAZARD AHEAD
            </div>
            <div className="text-xl font-semibold mt-1">
              150m - Blind Spot Alert
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes warningFlash {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}