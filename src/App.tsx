/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { SPCChart } from './components/SPCChart';
import { calculateSPC, generateHistogram, generateVirtualData } from './utils/spc';
import { StatsResult, HistogramData } from './types';
import Papa from 'papaparse';
import { Download, FileText, LayoutDashboard, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<number[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [usl, setUsl] = useState<number>(10.05);
  const [lsl, setLsl] = useState<number>(9.95);
  const [rawFileData, setRawFileData] = useState<any[]>([]);

  // Calculate Stats
  const stats: StatsResult | null = useMemo(() => {
    if (data.length === 0) return null;
    return calculateSPC(data, usl, lsl);
  }, [data, usl, lsl]);

  const histogramData: HistogramData[] = useMemo(() => {
    if (data.length === 0) return [];
    return generateHistogram(data, usl, lsl);
  }, [data, usl, lsl]);

  // Event Handlers
  const handleVirtualData = useCallback(() => {
    const vData = generateVirtualData(100, 10.02, 0.015);
    setData(vData);
    setColumns(['VirtualDimension']);
    setSelectedColumn('VirtualDimension');
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setRawFileData(results.data);
            const cols = Object.keys(results.data[0]);
            setColumns(cols);
            if (cols.length > 0) {
              setSelectedColumn(cols[0]);
              const values = results.data
                .map((row: any) => row[cols[0]])
                .filter((v): v is number => typeof v === 'number');
              setData(values);
            }
          }
        },
      });
    }
  };

  const handleColumnChange = (col: string) => {
    setSelectedColumn(col);
    if (rawFileData.length > 0) {
      const values = rawFileData
        .map((row: any) => row[col])
        .filter((v): v is number => typeof v === 'number');
      setData(values);
    }
  };

  const handleDownloadReport = () => {
    if (!stats) return;
    const reportData = [
      ['Metric', 'Value'],
      ['Mean', stats.mean.toFixed(4)],
      ['Std Dev', stats.stdDev.toFixed(4)],
      ['Min', stats.min.toFixed(4)],
      ['Max', stats.max.toFixed(4)],
      ['Range', stats.range.toFixed(4)],
      ['Cp', stats.cp.toFixed(3)],
      ['Cpk', stats.cpk.toFixed(3)],
      ['Defect Rate (%)', stats.defectRate.toFixed(2)],
      ['Judgement', stats.judgement],
    ];
    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPC_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden text-sm">
      <Sidebar
        usl={usl}
        lsl={lsl}
        onUslChange={setUsl}
        onLslChange={setLsl}
        onVirtualData={handleVirtualData}
        onFileUpload={handleFileUpload}
        columns={columns}
        selectedColumn={selectedColumn}
        onColumnChange={handleColumnChange}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-slate-800 text-sm">
              한화에어로스페이스 공정품질기술팀 
              <span className="font-normal text-slate-300 mx-3">|</span> 
              <span className="text-blue-600">SPC 분석 리포트</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleDownloadReport}
              disabled={!stats}
              className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:grayscale"
            >
              Export Data
            </button>
            <button 
              onClick={handleDownloadReport}
              disabled={!stats}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:grayscale shadow-sm"
            >
              Download Report (CSV)
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {!stats ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-3"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-2 border border-slate-200">
                  <LayoutDashboard className="w-8 h-8 text-slate-300" />
                </div>
                <h2 className="text-lg font-bold text-slate-700 tracking-tight">분석할 데이터를 로드하세요</h2>
                <p className="text-slate-400 max-w-sm mx-auto text-xs font-medium">
                  사이드바의 "가상 데이터 생성" 또는 파일 업로드를 통해<br/>공정능력지수(Cpk) 분석을 시작할 수 있습니다.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-7xl mx-auto"
              >
                {/* KPI Cards */}
                <StatsCards stats={stats} />

                {/* Main Visuals Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Area */}
                  <div className="lg:col-span-2">
                    <SPCChart data={histogramData} usl={usl} lsl={lsl} />
                  </div>

                  {/* Stats Table */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="text-xs font-bold text-slate-700 mb-5 uppercase tracking-wider">Descriptive Statistics</h3>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between py-2.5 border-b border-slate-50 text-[11px] font-medium">
                        <span className="text-slate-400">Maximum</span>
                        <span className="font-bold text-slate-700 font-mono">{stats.max.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-slate-50 text-[11px] font-medium">
                        <span className="text-slate-400">Minimum</span>
                        <span className="font-bold text-slate-700 font-mono">{stats.min.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-slate-50 text-[11px] font-medium">
                        <span className="text-slate-400">Range (R)</span>
                        <span className="font-bold text-slate-700 font-mono">{stats.range.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-slate-50 text-[11px] font-medium">
                        <span className="text-slate-400">Variance (σ²)</span>
                        <span className="font-bold text-slate-700 font-mono">{(stats.stdDev ** 2).toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between py-2.5 border-b border-slate-50 text-[11px] font-medium">
                        <span className="text-slate-400">Cp Index</span>
                        <span className="font-bold text-blue-600 font-mono">{stats.cp.toFixed(3)}</span>
                      </div>
                    </div>
                    <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="text-[9px] text-slate-400 uppercase font-bold mb-1.5 tracking-tighter">Capability Formula</div>
                       <div className="text-[10px] font-serif italic text-slate-500 leading-relaxed">
                         Cpk = min((USL-μ)/3σ, (μ-LSL)/3σ)
                       </div>
                    </div>
                  </div>
                </div>

                {/* Run Log / Status Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-tighter">Run Log</div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Analysis Active: {selectedColumn} | Last Update {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Compute Load</span>
                       <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="w-[15%] h-full bg-blue-500"></div>
                       </div>
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold tracking-tighter">VER 2.4.0 (LOCAL-ONLY)</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
