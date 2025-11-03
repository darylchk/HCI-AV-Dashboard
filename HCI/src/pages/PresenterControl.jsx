import React, { useState } from 'react';
import { useExperiment } from '../Components/experiment/ExperimentContext.jsx';
import { base44 } from '../api/base44Client.js';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  BarChart3, 
  AlertTriangle,
  Clock,
  Target,
  MapPin
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select.jsx';

function PresenterControlContent() {
  const { triggerHazard, resetExperiment, hazardActive, startAVOvertakeScenario, currentMessage, messageHistory, startUserLaneChangeScenario, userLaneChangeRequested, avPosition, startTrafficJamScenario, waitingForCameraApproval } = useExperiment();
  const [selectedLocation, setSelectedLocation] = useState('left');
  const [participantId, setParticipantId] = useState('');

  const { data: trials, refetch } = useQuery({
    queryKey: ['experimentTrials'],
    queryFn: () => base44.entities.ExperimentTrial.list('-timestamp'),
    initialData: [],
    refetchInterval: 3000 // Auto-refresh every 3 seconds
  });

  const handleTriggerSpatialAR = () => {
    triggerHazard('spatial-ar', selectedLocation);
  };

  const handleTriggerStandardText = () => {
    triggerHazard('standard-text', selectedLocation);
  };

  const handleReset = () => {
    resetExperiment();
  };

  // Calculate statistics
  const stats = {
    total: trials.length,
    spatialAR: trials.filter(t => t.version === 'spatial-ar'),
    standardText: trials.filter(t => t.version === 'standard-text'),
    avgTTR_spatial: trials.filter(t => t.version === 'spatial-ar').reduce((sum, t) => sum + t.ttr_ms, 0) / trials.filter(t => t.version === 'spatial-ar').length || 0,
    avgTTR_standard: trials.filter(t => t.version === 'standard-text').reduce((sum, t) => sum + t.ttr_ms, 0) / trials.filter(t => t.version === 'standard-text').length || 0,
    accuracy_spatial: (trials.filter(t => t.version === 'spatial-ar' && t.accuracy === 1).length / trials.filter(t => t.version === 'spatial-ar').length) * 100 || 0,
    accuracy_standard: (trials.filter(t => t.version === 'standard-text' && t.accuracy === 1).length / trials.filter(t => t.version === 'standard-text').length) * 100 || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Experiment Control Panel</h1>
            <p className="text-gray-400">Autonomous Vehicle Hazard Alert Study</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
            <div className={`w-3 h-3 rounded-full ${hazardActive ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-white font-medium">
              {hazardActive ? 'Trial Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* V2V Communication Scenarios */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scenario 1: AV Overtake */}
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Play className="w-6 h-6" />
                Scenario 1: AV Overtake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-950/50 rounded-lg p-4">
                <p className="text-green-200 font-semibold mb-2 text-sm">
                  Automated sequence:
                </p>
                <ol className="text-green-200 text-xs space-y-1 list-decimal list-inside">
                  <li>AV appears on your LEFT side</li>
                  <li>AV sends "Acknowledged Presence" (immediately)</li>
                  <li>Wait 3 seconds...</li>
                  <li>AV sends "Wants to Overtake" + AR activates</li>
                  <li><strong>USER:</strong> Click "Allow Merge"</li>
                  <li>AV sends "Thank You!" + Merge complete</li>
                </ol>
              </div>
              <Button
                onClick={() => {
                  console.log('AV Overtake button clicked!');
                  startAVOvertakeScenario();
                }}
                disabled={hazardActive || currentMessage || userLaneChangeRequested}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scenario 1
              </Button>
              {currentMessage && !userLaneChangeRequested && (
                <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                  <p className="text-yellow-400 text-xs">
                    Current: <span className="font-bold">{currentMessage}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scenario 2: User Lane Change */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <Play className="w-6 h-6" />
                Scenario 2: User Lane Change
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-950/50 rounded-lg p-4">
                <p className="text-purple-200 font-semibold mb-2 text-sm">
                  Multi-step interactive process:
                </p>
                <ol className="text-purple-200 text-xs space-y-1 list-decimal list-inside">
                  <li><strong>PRESENTER:</strong> Click "Start Scenario 2"</li>
                  <li>AV appears southwest + sends "Sees You!" (immediately)</li>
                  <li><strong>USER:</strong> Click "Initiate Lane Change" when ready</li>
                  <li>Wait 3 seconds...</li>
                  <li>AV replies "Acknowledged Intention"</li>
                  <li>Wait 3 seconds...</li>
                  <li>AV replies "Go Ahead!" (green approval)</li>
                  <li><strong>USER:</strong> Click "Acknowledge" to confirm</li>
                  <li>AV moves BEHIND (user completes overtake, red car disappears)</li>
                </ol>
              </div>
              <Button
                onClick={() => {
                  console.log('User Lane Change button clicked!');
                  startUserLaneChangeScenario();
                }}
                disabled={hazardActive || currentMessage || userLaneChangeRequested}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scenario 2
              </Button>
              {avPosition && !userLaneChangeRequested && (
                <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                  <p className="text-purple-300 text-xs animate-pulse">
                    ⚠ Scenario ready - User can now initiate lane change
                  </p>
                </div>
              )}
              {userLaneChangeRequested && (
                <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                  <p className="text-purple-400 text-xs">
                    Current: <span className="font-bold">{currentMessage}</span> | AV: {avPosition || 'moving'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scenario 3 and 4 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Scenario 3: Hazard Detection - Placeholder */}
          <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <AlertTriangle className="w-6 h-6" />
                Scenario 3: Hazard Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-950/50 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  Coming soon - Roadside hazard detection and warning system
                </p>
              </div>
              <Button
                disabled
                className="w-full bg-gray-700 text-gray-400 cursor-not-allowed py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scenario 3 (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Scenario 4: KPE Traffic Jam Detection */}
          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-xl">
                <AlertTriangle className="w-6 h-6" />
                Scenario 4: KPE Jam Detection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-950/50 rounded-lg p-4">
                <p className="text-red-200 font-semibold mb-2 text-sm">
                  Interactive traffic warning:
                </p>
                <ol className="text-red-200 text-xs space-y-1 list-decimal list-inside">
                  <li><strong>PRESENTER:</strong> Click "Start Scenario 4"</li>
                  <li>Traffic jam warning appears (XYZ-1234W)</li>
                  <li>TTS reads: "1000m ahead in KPE Tunnel"</li>
                  <li>TTS asks: "Would you like to view live footage?"</li>
                  <li>Camera icon flickers on dashboard</li>
                  <li><strong>USER:</strong> Says "Yes" (simulated via button)</li>
                  <li>AR screen switches to Jam.png</li>
                  <li>Camera icon turns green, car icon returns to normal</li>
                </ol>
              </div>
              <Button
                onClick={() => {
                  console.log('Traffic Jam Scenario button clicked!');
                  startTrafficJamScenario();
                }}
                disabled={hazardActive || currentMessage}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Scenario 4
              </Button>
              {waitingForCameraApproval && (
                <div className="bg-red-900/50 rounded-lg p-3 text-center">
                  <p className="text-red-300 text-xs animate-pulse">
                    ⚠ Waiting for user to approve camera view
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Control Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Version A - Spatial AR */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Version A: Spatial AR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-950/50 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  Flashing RED graphic with arrow and outline anchored to hazard location on the road.
                </p>
              </div>
              <Button
                onClick={handleTriggerSpatialAR}
                disabled={hazardActive}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Trigger Spatial AR Alert
              </Button>
            </CardContent>
          </Card>

          {/* Version B - Standard Text */}
          <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Version B: Standard Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-950/50 rounded-lg p-4">
                <p className="text-orange-200 text-sm">
                  Fixed RED box at top-center with generic text "HAZARD AHEAD 150m".
                </p>
              </div>
              <Button
                onClick={handleTriggerStandardText}
                disabled={hazardActive}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Trigger Standard Text Alert
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Trial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Hazard Location
                </label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-600">
                    <SelectItem value="left">Left Lane</SelectItem>
                    <SelectItem value="center">Center Lane</SelectItem>
                    <SelectItem value="right">Right Lane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Experiment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stats.total}</div>
                <div className="text-gray-400 text-sm">Total Trials</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/30 border-blue-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div className="text-3xl font-bold text-blue-300">
                    {stats.avgTTR_spatial.toFixed(0)}ms
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Avg TTR - Spatial AR</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-900/30 border-orange-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div className="text-3xl font-bold text-orange-300">
                    {stats.avgTTR_standard.toFixed(0)}ms
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Avg TTR - Standard</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/30 border-green-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-300 mb-2">
                  {((stats.accuracy_spatial + stats.accuracy_standard) / 2).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">Overall Accuracy</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Trial Data Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Trial ID</th>
                    <th className="text-left text-gray-400 font-medium py-3 px-4">Version</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">TTR (ms)</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-4">Accuracy</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-4">Location</th>
                    <th className="text-center text-gray-400 font-medium py-3 px-4">Actual</th>
                    <th className="text-right text-gray-400 font-medium py-3 px-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {trials.map((trial, index) => (
                    <tr key={trial.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                        #{(trials.length - index).toString().padStart(3, '0')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          trial.version === 'spatial-ar' 
                            ? 'bg-blue-900/50 text-blue-300' 
                            : 'bg-orange-900/50 text-orange-300'
                        }`}>
                          {trial.version === 'spatial-ar' ? 'Spatial AR' : 'Standard Text'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white font-mono">
                        {trial.ttr_ms.toFixed(0)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          trial.accuracy === 1 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-red-900/50 text-red-300'
                        }`}>
                          {trial.accuracy === 1 ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300 uppercase text-sm">
                        {trial.location_choice}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-400 uppercase text-sm">
                        {trial.actual_location}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400 text-sm">
                        {new Date(trial.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {trials.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No trials recorded yet. Start an experiment to collect data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PresenterControl() {
  return (
    <PresenterControlContent />
  );
}