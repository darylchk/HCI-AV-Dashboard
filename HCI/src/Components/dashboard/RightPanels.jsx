import React from 'react';
import { MapPin, Radio, Zap, Car, AlertCircle, CheckCircle, Heart, ArrowRight, Eye, ThumbsUp, ArrowLeft, AlertOctagon, Camera, UserCheck, Navigation } from 'lucide-react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';

export default function RightPanels() {
  const { waitingForMergeApproval, allowMerge, messageHistory, currentMessage, avPosition, simulateLaneChangeLeft, userLaneChangeRequested, completeUserLaneChange, waitingForCameraApproval, viewCameraFeed, declineCameraFeed, userGoesFirst, avGoesFirst, waitingForRightOfWay } = useExperiment();
  
  return (
    <div className="w-80 bg-[#1a1919] border-l border-gray-700 flex flex-col gap-4 p-4 overflow-y-auto">
      
      {/* Road Hazards & Traffic Panel - Smaller */}
      <div className="bg-[#2F2E2E] rounded-2xl overflow-hidden">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-[#F3F7FF] font-semibold flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#F8A406]" />
            Road Hazards & Traffic
          </h3>
        </div>
        <div className="p-3">
          {/* Scenario-specific hazards only */}
          <div className="space-y-2 text-sm">
            {currentMessage === 'trafficjam' && (
              // Scenario 4: Show traffic congestion
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[#F3F7FF] text-xs">Heavy traffic congestion</span>
                </div>
                <span className="text-red-500 text-xs font-bold">HIGH</span>
              </div>
            )}
            {currentMessage === 'rightofway' && (
              // Scenario 5: Show faulty traffic light
              <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[#F3F7FF] text-xs">Faulty Traffic Light</span>
                </div>
                <span className="text-red-500 text-xs font-bold">HIGH</span>
              </div>
            )}
            {!currentMessage && (
              <div className="text-[#F3F7FF]/50 text-xs text-center py-2">
                No hazards detected
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Communications Panel - Bigger */}
      <div className="bg-[#2F2E2E] rounded-2xl overflow-hidden flex-1">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-[#F3F7FF] font-semibold flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#F8A406]" />
            V2V Communications
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {messageHistory.length > 0 ? (
            // Show only last 2 messages in reverse order (most recent first)
            [...messageHistory].reverse().slice(0, 2).map((msg, index) => (
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
                  {msg.type === 'rightofway' && (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Right of Way - Would You Go First?</span>
                    </>
                  )}
                  {msg.type === 'avmovesfirst' && (
                    <>
                      <Heart className="w-4 h-4 fill-current" />
                      <span>AV Will Move First - Thank You</span>
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
              disabled
              className="bg-gray-700 text-[#F3F7FF] rounded-lg p-3 text-xs font-medium cursor-not-allowed"
            >
              Allow Merge
            </button>
            <button 
              disabled
              className="bg-gray-700 text-[#F3F7FF] rounded-lg p-3 text-xs font-medium cursor-not-allowed col-span-2"
            >
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
            <button 
              onClick={userGoesFirst}
              disabled={!waitingForRightOfWay}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                waitingForRightOfWay
                  ? 'bg-purple-600 hover:bg-purple-700 text-white animate-pulse font-bold shadow-lg shadow-purple-600/50' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {waitingForRightOfWay && <UserCheck className="w-4 h-4" />}
              I'll Go First
            </button>
            <button 
              onClick={avGoesFirst}
              disabled={!waitingForRightOfWay}
              className={`rounded-lg p-3 text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                waitingForRightOfWay
                  ? 'bg-orange-600 hover:bg-orange-700 text-white font-bold' 
                  : 'bg-gray-700 text-[#F3F7FF] cursor-not-allowed'
              }`}
            >
              {waitingForRightOfWay && <Car className="w-4 h-4" />}
              You Go First
            </button>
          </div>
          {waitingForCameraApproval && (
            <div className="mb-3 text-center text-blue-400 text-xs animate-pulse">
              📹 Would you like to view the live footage?
            </div>
          )}
          {waitingForRightOfWay && (
            <div className="mb-3 text-center text-purple-400 text-xs animate-pulse">
              🚦 Traffic light malfunction - Who should go first?
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