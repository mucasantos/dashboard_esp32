import React, { useState } from 'react';

import AiInsights from './components/AiInsights';
import ChartPanel from './components/ChartPanel';
import ControlPanel from './components/ControlPanel';
import DashboardHeader from './components/DashboardHeader';
import SensorOverview from './components/SensorOverview';
import { useDashboard } from './hooks/useDashboard';
import { analyzeSensorData } from './services/geminiService';
import { AiAnalysisResult } from './types';

function App() {
  const {
    connectionStatus,
    controls,
    deviceUrl,
    history,
    isSimulated,
    sensorData,
    sendCommand,
    setDeviceUrl,
    setIsSimulated,
  } = useDashboard();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeSensorData(sensorData);
    setAiResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#13233b_0%,#0f172a_38%,#020617_100%)] px-3 py-4 text-slate-200 sm:px-4 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6 lg:space-y-7">
        <DashboardHeader
          connectionStatus={connectionStatus}
          deviceUrl={deviceUrl}
          isSimulated={isSimulated}
          onDeviceUrlChange={setDeviceUrl}
          onModeChange={setIsSimulated}
        />

        <SensorOverview sensorData={sensorData} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
          <div className="xl:col-span-2">
            <ChartPanel
              data={history}
              title="Core Environment"
              containerClassName="min-h-[360px]"
              chartHeightClassName="h-[260px] sm:h-[360px]"
              lines={[
                { dataKey: 'temperature', label: 'Temp (°C)', stroke: '#fb7185' },
                { dataKey: 'humidity', label: 'Humidity (%)', stroke: '#22d3ee' },
              ]}
            />
          </div>

          <div>
            <ControlPanel controls={controls} onControlChange={sendCommand} />
          </div>
        </div>

        <section className="space-y-3">
          <div className="px-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Extended Telemetry
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <ChartPanel
            data={history}
            title="Ambient Light"
            containerClassName="min-h-[250px] sm:min-h-[280px]"
            chartHeightClassName="h-[180px] sm:h-[210px]"
            lines={[{ dataKey: 'lux', label: 'Lux', stroke: '#fbbf24' }]}
          />
          <ChartPanel
            data={history}
            title="Acoustic Activity"
            containerClassName="min-h-[250px] sm:min-h-[280px]"
            chartHeightClassName="h-[180px] sm:h-[210px]"
            lines={[{ dataKey: 'decibels', label: 'dB', stroke: '#a78bfa' }]}
          />
          </div>
        </section>

        <section className="space-y-3">
          <div className="px-1">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Optional Intelligence Layer
            </p>
          </div>
          <AiInsights isAnalyzing={isAnalyzing} onAnalyze={handleAiAnalysis} result={aiResult} />
        </section>
      </div>
    </div>
  );
}

export default App;
