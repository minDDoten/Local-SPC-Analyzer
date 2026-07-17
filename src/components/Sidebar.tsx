/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Settings, Upload, Database, ChevronRight, Activity } from 'lucide-react';

interface SidebarProps {
  usl: number;
  lsl: number;
  onUslChange: (val: number) => void;
  onLslChange: (val: number) => void;
  onVirtualData: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  columns: string[];
  selectedColumn: string;
  onColumnChange: (val: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  usl,
  lsl,
  onUslChange,
  onLslChange,
  onVirtualData,
  onFileUpload,
  columns,
  selectedColumn,
  onColumnChange,
}) => {
  return (
    <aside className="w-64 bg-canvas-dark text-muted-gray flex flex-col border-r border-hairline-on-dark shrink-0">
      <div className="p-5 border-b border-surface-elevated-dark">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-binance-yellow rounded-sm flex-shrink-0 flex items-center justify-center">
             <Activity className="w-4 h-4 text-ink-dark" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm uppercase">Local SPC Analyzer</span>
        </div>
        
        <div className="space-y-6">
          {/* Data Acquisition */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-muted-gray block tracking-wider">Data Acquisition</label>
            <button 
              onClick={onVirtualData}
              className="w-full bg-binance-yellow hover:bg-binance-yellow-active text-ink-dark text-[12px] font-bold py-2 px-3 rounded-[6px] flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              Load Mock Data (N=50)
            </button>
            
            <div className="relative group">
              <input
                type="file"
                accept=".csv"
                onChange={onFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="border border-surface-elevated-dark group-hover:border-binance-yellow/50 rounded-[8px] p-4 text-center transition-all bg-surface-card-dark">
                <Upload className="w-4 h-4 text-muted-gray mx-auto mb-1 group-hover:text-binance-yellow" />
                <span className="text-[11px] text-muted-gray font-bold group-hover:text-slate-200">DRAG & DROP CSV</span>
              </div>
            </div>
          </div>

          {/* Analysis Variable */}
          {columns.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase font-bold text-muted-gray block tracking-wider">Analysis Variable</label>
              <div className="relative">
                <select 
                  value={selectedColumn}
                  onChange={(e) => onColumnChange(e.target.value)}
                  className="w-full bg-surface-card-dark border border-surface-elevated-dark text-slate-200 text-xs rounded-[6px] py-2 px-2 focus:border-binance-yellow outline-none appearance-none cursor-pointer font-bold"
                >
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-3 h-3 absolute right-2 top-2.5 rotate-90 text-muted-gray pointer-events-none" />
              </div>
            </div>
          )}

          {/* Spec Limits */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] uppercase font-bold text-muted-gray block tracking-wider">Spec Limits (mm)</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-[9px] text-muted-gray mb-1 block font-bold">USL</span>
                <input 
                  type="number" 
                  step="0.001"
                  value={usl}
                  onChange={(e) => onUslChange(parseFloat(e.target.value))}
                  className="w-full bg-surface-card-dark border border-surface-elevated-dark text-white text-[11px] rounded-[6px] py-1.5 px-2 focus:border-binance-yellow outline-none font-mono font-bold"
                />
              </div>
              <div className="flex-1">
                <span className="text-[9px] text-muted-gray mb-1 block font-bold">LSL</span>
                <input 
                  type="number" 
                  step="0.001"
                  value={lsl}
                  onChange={(e) => onLslChange(parseFloat(e.target.value))}
                  className="w-full bg-surface-card-dark border border-surface-elevated-dark text-white text-[11px] rounded-[6px] py-1.5 px-2 focus:border-binance-yellow outline-none font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4">
        <div className="bg-surface-elevated-dark/30 rounded-[8px] p-3 border border-surface-elevated-dark/50">
          <div className="text-[9px] text-muted-gray uppercase font-bold mb-1.5">Environment Status</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-trading-up"></div>
            <span className="text-[10px] font-mono text-muted-gray uppercase tracking-tight font-bold">Air-Gapped Network</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

