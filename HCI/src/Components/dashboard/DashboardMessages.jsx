import React from 'react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';
import { Car, AlertTriangle, CheckCircle, ArrowRight, Heart, Eye, ThumbsUp, AlertOctagon, Camera, Navigation } from 'lucide-react';

export default function DashboardMessages() {
  const { hazardActive, messageHistory, currentMessage } = useExperiment();

  // Get last 3 messages only, reversed to show most recent first
  const recentMessages = messageHistory.slice(-3).reverse();

  return (
    <div className="w-72 bg-[#1a1919] border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-[#F3F7FF] font-semibold text-lg">Dashboard Messages</h2>
      </div>

      {/* Messages List - Mini OBU Style */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {recentMessages.length > 0 ? (
          <>
            {recentMessages.map((msg, index) => (
              <div 
                key={index}
                className={`bg-[#2F2E2E] rounded-xl p-4 transition-all ${
                  msg.type === currentMessage 
                    ? 'ring-2 ring-[#F8A406] shadow-lg shadow-[#F8A406]/20' 
                    : ''
                }`}
                style={{
                  animation: 'messageAppear 0.3s ease-out'
                }}
              >
                {/* Mini OBU Design */}
                <div className="flex flex-col items-center space-y-3">
                  {/* Car Image - Use caution.png for traffic jam/camera question, otherwise use car model */}
                  <div className="relative flex justify-center">
                    <img 
                      src={msg.type === 'trafficjam' || msg.type === 'cameraquestion' 
                        ? "/src/Components/images/caution.png" 
                        : "/src/Components/images/AV-Car-Model.png"}
                      alt={msg.type === 'trafficjam' || msg.type === 'cameraquestion' ? "Caution" : "Vehicle"}
                      className="w-20 h-auto object-contain"
                    />
                  </div>

                  {/* Message Badge */}
                  {msg.type === 'overtaking' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <ArrowRight className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Overtaking From: YOUR LEFT</span>
                      </div>
                    </div>
                  ) : msg.type === 'thankyou' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <Heart className="w-4 h-4 fill-[#2F2E2E]" strokeWidth={3} />
                        <span className="font-bold">Thank You!</span>
                      </div>
                    </div>
                  ) : msg.type === 'seesyou' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <Eye className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Sees You!</span>
                      </div>
                    </div>
                  ) : msg.type === 'intention' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <CheckCircle className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Acknowledged Intention!</span>
                      </div>
                    </div>
                  ) : msg.type === 'goahead' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#34C759] border-2 border-[#34C759] text-white px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <ThumbsUp className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Go Ahead!</span>
                      </div>
                    </div>
                  ) : msg.type === 'trafficjam' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-red-600 border-2 border-red-600 text-white px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <AlertOctagon className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Traffic Jam!</span>
                      </div>
                    </div>
                  ) : msg.type === 'cameraquestion' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-blue-600 border-2 border-blue-600 text-white px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <Camera className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">View Camera Footage?</span>
                      </div>
                    </div>
                  ) : msg.type === 'rightofway' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-purple-600 border-2 border-purple-600 text-white px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <Navigation className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Right of Way</span>
                      </div>
                    </div>
                  ) : msg.type === 'avmovesfirst' ? (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <Heart className="w-4 h-4 fill-[#2F2E2E]" strokeWidth={3} />
                        <span className="font-bold">AV Will Move First</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center w-full">
                      <div className="bg-[#F8A406] border-2 border-[#F8A406] text-[#2F2E2E] px-3 py-1.5 rounded-lg shadow-lg inline-flex items-center gap-2 text-xs">
                        <CheckCircle className="w-4 h-4" strokeWidth={3} />
                        <span className="font-bold">Acknowledged Presence!</span>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Info Card */}
                  <div className="bg-[#1a1919] rounded-lg p-3 w-full border border-gray-700">
                    <div className="text-center space-y-1">
                      <div className="text-[#F8A406] font-black text-sm tracking-wide">
                        {msg.vehicleId}
                      </div>
                      <div className="text-[#F3F7FF] text-xs font-semibold">
                        {msg.type === 'acknowledged' ? 'Sees You!' : 
                         msg.type === 'thankyou' ? 'Merge Complete' : 
                         msg.type === 'seesyou' ? 'Sees You!' :
                         msg.type === 'intention' ? 'Understands Your Intention' :
                         msg.type === 'goahead' ? 'Safe to Proceed' :
                         msg.type === 'trafficjam' ? 'Traffic Jam - KPE Tunnel' :
                         msg.type === 'cameraquestion' ? 'View Live Camera Feed?' :
                         msg.type === 'rightofway' ? 'Would You Like to Go First?' :
                         msg.type === 'avmovesfirst' ? 'Thank You - AV Will Go First' :
                         'Wants to Overtake'}
                      </div>
                      <div className="text-[#F3F7FF]/50 text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-[#F3F7FF]/50 text-sm py-8">
            No messages yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <div className="text-[#F3F7FF]/50 text-xs text-center">
          Showing last {Math.min(recentMessages.length, 3)} message{recentMessages.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}