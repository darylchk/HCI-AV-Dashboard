import React from 'react';
import { Clock, Battery, Wifi, Radio, Car, CloudRain, Wind, Phone, Music, Smartphone, Volume2, Fan, Camera } from 'lucide-react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';

export default function TopBar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const { waitingForCameraApproval, showingCamera } = useExperiment();

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 bg-[#1a1919] border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <div className="text-[#F3F7FF] text-sm font-medium">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-[#34C759] text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></span>
          Full Self-Driving Active
        </div>
      </div>

      {/* Center Icons - Tesla Style Dashboard */}
      <div className="flex items-center gap-1 bg-[#2F2E2E] rounded-lg px-2 py-1">
        {/* Car Icon - Green when in AR mode, normal when camera active */}
        <button className={`transition-colors p-2 rounded ${
          !showingCamera ? 'text-[#34C759] bg-[#34C759]/20' : 'text-[#F3F7FF] hover:text-[#F8A406] hover:bg-[#3a3939]'
        }`}>
          <Car className="w-5 h-5" />
        </button>
        
        {/* Camera Icon - Flickers when waiting, green when active */}
        <button className={`transition-colors p-2 rounded ${
          showingCamera 
            ? 'text-[#34C759] bg-[#34C759]/20' 
            : waitingForCameraApproval 
              ? 'text-[#F8A406] bg-[#F8A406]/20 animate-pulse' 
              : 'text-[#F3F7FF] hover:text-[#F8A406] hover:bg-[#3a3939]'
        }`}>
          <Camera className="w-5 h-5" />
        </button>
        
        {/* Windshield Defrost */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Wind className="w-5 h-5" />
        </button>
        
        {/* Rear Defrost */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <line x1="7" y1="9" x2="17" y2="9" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="7" y1="15" x2="17" y2="15" />
          </svg>
        </button>
        
        {/* Phone */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Phone className="w-5 h-5" />
        </button>
        
        {/* Temperature - 20° */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939] flex items-center gap-1">
          <span className="text-sm font-medium">20°</span>
        </button>
        
        {/* Climate/Fan - MANUAL */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Fan className="w-5 h-5" />
        </button>
        
        {/* Passenger Seat */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V9c0-1.1.9-2 2-2h4.18C9.6 6.09 10.75 5 12 5c1.25 0 2.4 1.09 2.82 2H19c1.1 0 2 .9 2 2v3h-2V7z"/>
            <path d="M13 20v-6H3v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6h-8v6h-2z"/>
          </svg>
        </button>
        
        {/* Music */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Music className="w-5 h-5" />
        </button>
        
        {/* Phone/Device */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Smartphone className="w-5 h-5" />
        </button>
        
        {/* Volume */}
        <button className="text-[#F3F7FF] hover:text-[#F8A406] transition-colors p-2 rounded hover:bg-[#3a3939]">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6 text-[#F3F7FF] text-sm">
        <div className="flex items-center gap-2">
          <Battery className="w-5 h-5" />
          <span className="font-medium">87%</span>
        </div>
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#34C759]" />
          <span className="font-medium">7 Connected Vehicles</span>
        </div>
      </div>
    </div>
  );
}