import React from 'react';
import { Cpu, LayoutDashboard, Server, Wifi } from 'lucide-react';

import { ConnectionStatus } from '../types';

interface DashboardHeaderProps {
  connectionStatus: ConnectionStatus;
  deviceUrl: string;
  isSimulated: boolean;
  onDeviceUrlChange: (value: string) => void;
  onModeChange: (isSimulated: boolean) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  connectionStatus,
  deviceUrl,
  isSimulated,
  onDeviceUrlChange,
  onModeChange,
}) => {
  return (
    <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-[0_30px_70px_rgba(15,23,42,0.35)] backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 p-3 text-slate-950 shadow-lg shadow-cyan-500/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                Edge Telemetry
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-2xl">
                ESP32 IoT TecNaMao
              </h1>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    connectionStatus === ConnectionStatus.CONNECTED
                      ? 'bg-emerald-500 animate-pulse'
                      : connectionStatus === ConnectionStatus.CONNECTING
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                />
                <span>{connectionStatus}</span>
              </div>
            </div>
          </div>

          <div className="hidden rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-400 sm:flex sm:items-center sm:gap-2">
            <Cpu className="h-4 w-4 text-sky-400" />
            <span>Live device stream</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 p-1">
            <button
              onClick={() => onModeChange(true)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                isSimulated
                  ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => onModeChange(false)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                !isSimulated
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Real Device
            </button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {!isSimulated && (
              <input
                type="text"
                value={deviceUrl}
                onChange={(event) => onDeviceUrlChange(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-sky-500 sm:w-64"
                placeholder="ws://192.168.15.3/ws"
              />
            )}

            <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-400">
              {isSimulated ? (
                <>
                  <Server className="h-4 w-4 text-amber-400" />
                  <span>Simulated device</span>
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 text-emerald-400" />
                  <span>Live ESP32 link</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
