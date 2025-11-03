import React from 'react';
import { useExperiment } from '../Components/experiment/ExperimentContext.jsx';
import TopBar from '../Components/dashboard/TopBar.jsx';
import DrivingView from '../Components/dashboard/DrivingView.jsx';
import DashboardMessages from '../Components/dashboard/DashboardMessages.jsx';
import RightPanels from '../Components/dashboard/RightPanels.jsx';
import LocationModal from '../Components/dashboard/LocationModal.jsx';

function DashboardContent() {
  const { showLocationModal, currentMessage, messageHistory } = useExperiment();

  console.log('Dashboard - currentMessage:', currentMessage, 'messageHistory:', messageHistory);

  return (
    <div className="h-screen flex flex-col bg-[#2F2E2E] text-[#F3F7FF] overflow-hidden">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <DashboardMessages />
        <DrivingView />
        <RightPanels />
      </div>

      {showLocationModal && (
        <LocationModal onClose={() => {}} />
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardContent />
  );
}