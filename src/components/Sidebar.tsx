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
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-blue-500 rounded flex-shrink-0 flex items-center justify-center">
             <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">Local SPC Analyzer</span>
        </div>
        
        <div className="space-y-5">
          {/* Data Acquisition */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">Data Acquisition</label>
            <button 
              onClick={onVirtualData}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium py-2 px-3 rounded border border-slate-700 flex items-center justify-center gap-2 transition-colors"
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
              <div className="border-2 border-dashed border-slate-700 group-hover:border-blue-500/50 rounded-lg p-4 text-center transition-all bg-slate-800/20">
                <Upload className="w-4 h-4 text-slate-500 mx-auto mb-1 group-hover:text-blue-400" />
                <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-400">Drag & Drop CSV</span>
              </div>
            </div>
          </div>

          {/* Analysis Variable */}
          {columns.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">Analysis Variable</label>
              <select 
                value={selectedColumn}
                onChange={(e) => onColumnChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded py-2 px-2 focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Spec Limits */}
          <div className="space-y-2 pt-2">
            <label className="text-[10px] uppercase font-semibold text-slate-500 block tracking-wider">Spec Limits (mm)</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="text-[9px] text-slate-500 mb-1 block">USL</span>
                <input 
                  type="number" 
                  step="0.001"
                  value={usl}
                  onChange={(e) => onUslChange(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] rounded py-1.5 px-2 focus:border-blue-500 outline-none font-mono"
                />
              </div>
              <div className="flex-1">
                <span className="text-[9px] text-slate-500 mb-1 block">LSL</span>
                <input 
                  type="number" 
                  step="0.001"
                  value={lsl}
                  onChange={(e) => onLslChange(parseFloat(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] rounded py-1.5 px-2 focus:border-blue-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4">
        <div className="bg-slate-800/40 rounded p-3 border border-slate-700/50">
          <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5">Environment Status</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">Air-Gapped Network</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

