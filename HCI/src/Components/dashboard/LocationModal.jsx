import React, { useState } from 'react';
import { useExperiment } from '../experiment/ExperimentContext.jsx';
import { base44 } from '../../api/base44Client.js';
import { X, MapPin } from 'lucide-react';

export default function LocationModal({ onClose }) {
  const { currentTrialId, trialStartTime, activeVersion, hazardLocation, resetExperiment } = useExperiment();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedLocation) return;

    setIsSubmitting(true);
    
    const ttrMs = Date.now() - trialStartTime;
    const accuracy = selectedLocation === hazardLocation ? 1 : 0;

    try {
      await base44.entities.ExperimentTrial.create({
        trial_id: currentTrialId,
        version: activeVersion,
        ttr_ms: ttrMs,
        accuracy: accuracy,
        location_choice: selectedLocation,
        actual_location: hazardLocation,
        timestamp: new Date().toISOString()
      });

      resetExperiment();
      onClose();
    } catch (error) {
      console.error('Error saving trial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2F2E2E] border border-gray-700 text-[#F3F7FF] max-w-2xl w-full mx-4 rounded-xl shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <MapPin className="w-6 h-6 text-[#F8A406]" />
            Hazard Location Assessment
          </h2>
        </div>

        <div className="space-y-6 py-6 px-6">
          <p className="text-lg text-center">
            Where was the hazard located?
          </p>

          {/* Location Selection */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setSelectedLocation('left')}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-200 ${
                selectedLocation === 'left'
                  ? 'bg-[#F8A406]/20 border-[#F8A406] scale-105'
                  : 'bg-[#1a1919] border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">←</div>
                <div className="font-bold text-lg">LEFT</div>
                <div className="text-sm opacity-70 mt-1">Left Lane</div>
              </div>
              {selectedLocation === 'left' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#F8A406] rounded-full flex items-center justify-center">
                  <span className="text-[#2F2E2E] font-bold">✓</span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedLocation('center')}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-200 ${
                selectedLocation === 'center'
                  ? 'bg-[#F8A406]/20 border-[#F8A406] scale-105'
                  : 'bg-[#1a1919] border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">↑</div>
                <div className="font-bold text-lg">CENTER</div>
                <div className="text-sm opacity-70 mt-1">Center Lane</div>
              </div>
              {selectedLocation === 'center' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#F8A406] rounded-full flex items-center justify-center">
                  <span className="text-[#2F2E2E] font-bold">✓</span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSelectedLocation('right')}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-200 ${
                selectedLocation === 'right'
                  ? 'bg-[#F8A406]/20 border-[#F8A406] scale-105'
                  : 'bg-[#1a1919] border-gray-700 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">→</div>
                <div className="font-bold text-lg">RIGHT</div>
                <div className="text-sm opacity-70 mt-1">Right Lane</div>
              </div>
              {selectedLocation === 'right' && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#F8A406] rounded-full flex items-center justify-center">
                  <span className="text-[#2F2E2E] font-bold">✓</span>
                </div>
              )}
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-transparent border border-gray-600 text-[#F3F7FF] hover:bg-gray-700 px-6 py-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedLocation || isSubmitting}
              className="bg-[#F8A406] hover:bg-[#d99005] text-[#2F2E2E] font-bold px-8 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}