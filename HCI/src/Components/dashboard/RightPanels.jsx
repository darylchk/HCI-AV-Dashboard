import React from 'react';
import { MapPin, Radio, Zap, Car, AlertCircle, CheckCircle, Heart, ArrowRight, Eye, ThumbsUp, ArrowLeft, AlertOctagon, Camera } from 'lucide-react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';

export default function RightPanels() {
  const { waitingForMergeApproval, allowMerge, messageHistory, currentMessage, avPosition, simulateLaneChangeLeft, userLaneChangeRequested, completeUserLaneChange, waitingForCameraApproval, viewCameraFeed, declineCameraFeed } = useExperiment();
  
  return (
    <div className="w-80 bg-[#1a1919] border-l border-gray-700 flex flex-col gap-4 p-4 overflow-y-auto">
      
      {/* Road Hazards & Traffic Panel */}
      <div className="bg-[#2F2E2E] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-[#F3F7FF] font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F8A406]" />
            Road Hazards & Traffic
          </h3>
        </div>
        <div className="p-4">
          {/* Mini map visualization */}
          <div className="relative h-24 bg-gray-800 rounded-lg mb-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-[#F8A406]"></div>
              <div className="absolute w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Nearby Hazards */}
          <div className="space-y-2 text-sm">
            <div className="text-[#F3F7FF]/70 font-medium mb-2">Nearby Hazards</div>
            {currentMessage === 'trafficjam' ? (
              // Scenario 4: Only show traffic congestion
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[#F3F7FF] text-xs">Heavy traffic congestion</span>
                </div>
                <span className="text-red-500 text-xs font-bold">high</span>
              </div>
            ) : (
              // Default: Show all hazards
              <>
                <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#F8A406] rounded-full"></div>
                    <span className="text-[#F3F7FF] text-xs">Large pothole in right lane</span>
                  </div>
                  <span className="text-[#F8A406] text-xs font-bold">warning</span>
                </div>
                <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-[#F3F7FF] text-xs">Heavy traffic congestion</span>
                  </div>
                  <span className="text-red-500 text-xs font-bold">high</span>
                </div>
                <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-[#F3F7FF] text-xs">Lane closure - construction zone</span>
                  </div>
                  <span className="text-blue-500 text-xs font-bold">low</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Communications Panel */}
      <div className="bg-[#2F2E2E] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-[#F3F7FF] font-semibold flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#F8A406]" />
            V2V Communications
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {messageHistory.length > 0 ? (
            // Show messages in reverse order (most recent first)
            [...messageHistory].reverse().map((msg, index) => (
              <div 
                key={index}
                className={`rounded-xl p-3 transition-all ${
                  msg.type === currentMessage
                    ? 'bg-[#F8A406]/20 border-2 border-[#F8A406]'
                    : 'bg-[#1a1919] border border-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold ${
                    msg.type === currentMessage ? 'text-[#F8A406]' : 'text-[#F3F7FF]/50'
                  }`}>{msg.vehicleId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    msg.type === currentMessage
                      ? 'bg-[#F8A406] text-[#2F2E2E] font-bold'
                      : 'bg-gray-700/50 text-[#F3F7FF]/50'
                  }`}>
                    {msg.type === currentMessage ? 'active' : 'sent'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-xs ${
                  msg.type === currentMessage ? 'text-[#F3F7FF]' : 'text-[#F3F7FF]/50'
                }`}>
                  {msg.type === 'acknowledged' && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Acknowledged Presence</span>
                    </>
                  )}
                  {msg.type === 'overtaking' && (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Requesting Lane Change</span>
                    </>
                  )}
                  {msg.type === 'thankyou' && (
                    <>
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Thank You - Merge Complete</span>
                    </>
                  )}
                  {msg.type === 'seesyou' && (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Sees You - Lane Change Intent</span>
                    </>
                  )}
                  {msg.type === 'intention' && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Acknowledged Intention</span>
                    </>
                  )}
                  {msg.type === 'goahead' && (
                    <>
                      <ThumbsUp className="w-4 h-4" />
                      <span>Go Ahead - Safe to Proceed</span>
                    </>
                  )}
                  {msg.type === 'trafficjam' && (
                    <>
                      <AlertOctagon className="w-4 h-4" />
                      <span>Traffic Jam - KPE Tunnel</span>
                    </>
                  )}
                  {msg.type === 'cameraquestion' && (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>View Live Camera Footage?</span>
                    </>
                  )}
                </div>
                <div className={`text-xs mt-1 ${
                  msg.type === currentMessage ? 'text-[#F3F7FF]/50' : 'text-[#F3F7FF]/30'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[#F3F7FF]/50 text-xs text-center py-4">
              No communications yet
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-[#2F2E2E] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-[#F3F7FF] font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#F8A406]" />
            Quick Actions
          </h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button disabled className="bg-gray-700 text-[#F3F7FF] rounded-lg p-3 text-xs font-medium cursor-not-allowed">
              Acknowledge
            </button>
            <button 
              onClick={() => {
                // Scenario 1: Allow AV to merge
                if (currentMessage === 'overtaking' && waitingForMergeApproval) {
                  allowMerge();
                }
                // Scenario 2: Acknowledge "Go Ahead" and complete lane change
                else if (currentMessage === 'goahead' && waitingForMergeApproval && userLaneChangeRequested) {
                  completeUserLaneChange();
                }
              }}
              disabled={!waitingForMergeApproval}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                waitingForMergeApproval 
                  ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse font-bold shadow-lg shadow-green-600/50' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {waitingForMergeApproval && <CheckCircle className="w-4 h-4" />}
              {currentMessage === 'goahead' && userLaneChangeRequested ? 'Acknowledge' : 'Allow Merge'}
            </button>
            <button 
              onClick={simulateLaneChangeLeft}
              disabled={currentMessage !== 'seesyou' || userLaneChangeRequested}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 col-span-2 ${
                currentMessage === 'seesyou' && !userLaneChangeRequested
                  ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse font-bold shadow-lg shadow-blue-600/50' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {currentMessage === 'seesyou' && !userLaneChangeRequested && <ArrowLeft className="w-4 h-4" />}
              Initiate Lane Change
            </button>
            <button 
              onClick={viewCameraFeed}
              disabled={!waitingForCameraApproval}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                waitingForCameraApproval
                  ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse font-bold shadow-lg shadow-green-600/50' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {waitingForCameraApproval && <CheckCircle className="w-4 h-4" />}
              Yes
            </button>
            <button 
              onClick={declineCameraFeed}
              disabled={!waitingForCameraApproval}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                waitingForCameraApproval
                  ? 'bg-red-600 hover:bg-red-700 text-white font-bold' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {waitingForCameraApproval && <AlertCircle className="w-4 h-4" />}
              No
            </button>
            <button disabled className="bg-gray-700 text-[#F3F7FF] rounded-lg p-3 text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Right Of Way
            </button>
          </div>
          {waitingForMergeApproval && currentMessage === 'overtaking' && (
            <div className="mb-3 text-center text-[#F8A406] text-xs animate-pulse">
              ⚠ AV is waiting for your approval
            </div>
          )}
          {waitingForMergeApproval && currentMessage === 'goahead' && (
            <div className="mb-3 text-center text-green-400 text-xs animate-pulse">
              ✓ Safe to proceed - Click "Acknowledge" to complete lane change
            </div>
          )}
          {currentMessage === 'seesyou' && !userLaneChangeRequested && (
            <div className="mb-3 text-center text-blue-400 text-xs animate-pulse">
              💡 AV sees you - Click "Initiate Lane Change" when ready
            </div>
          )}
          {waitingForCameraApproval && (
            <div className="mb-3 text-center text-blue-400 text-xs animate-pulse">
              📹 Would you like to view the live footage?
            </div>
          )}
          <div className="text-[#F3F7FF]/70 text-xs font-medium mb-2">Report Hazard:</div>
          <div className="flex gap-2">
            <button disabled className="flex-1 bg-gray-700 text-[#F3F7FF] rounded-lg py-2 text-xs cursor-not-allowed">
              Pothole
            </button>
            <button disabled className="flex-1 bg-gray-700 text-[#F3F7FF] rounded-lg py-2 text-xs cursor-not-allowed">
              Traffic
            </button>
            <button disabled className="flex-1 bg-gray-700 text-[#F3F7FF] rounded-lg py-2 text-xs cursor-not-allowed">
              Accident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}