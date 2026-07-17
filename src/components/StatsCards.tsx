/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { StatsResult } from '../types';
import { BarChart2, ShieldCheck, AlertCircle, XCircle, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardsProps {
  stats: StatsResult;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const isPass = stats.cpk >= 1.33;
  const isWarning = stats.cpk >= 1.0 && stats.cpk < 1.33;
  const isFail = stats.cpk < 1.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1: Sample Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
      >
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Sample Statistics</div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {stats.n} <span className="text-xs font-normal text-slate-400 ml-1">samples</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Mean (μ): {stats.mean.toFixed(4)} mm</div>
          </div>
          <div className="text-slate-200">
            <Layers className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {/* Card 2: Quality Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
      >
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Quality Metrics</div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {stats.stdDev.toFixed(4)} <span className="text-xs font-normal text-slate-400 ml-1">sigma</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Defect Rate: {stats.defectRate.toFixed(3)}%</div>
          </div>
          <div className="text-blue-100">
            <BarChart2 className="w-8 h-8" />
          </div>
        </div>
      </motion.div>

      {/* Card 3: Cpk Index (Result) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "p-4 rounded-xl border shadow-sm border-l-4 flex flex-col justify-between transition-colors",
          isPass && "bg-emerald-50 border-emerald-200 border-l-emerald-500",
          isWarning && "bg-amber-50 border-amber-200 border-l-amber-500",
          isFail && "bg-rose-50 border-rose-200 border-l-rose-500"
        )}
      >
        <div className={cn(
          "text-[10px] uppercase font-bold mb-2 tracking-wider",
          isPass && "text-emerald-600",
          isWarning && "text-amber-600",
          isFail && "text-rose-600"
        )}>Cpk Index (Result)</div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className={cn(
              "text-2xl font-bold",
              isPass && "text-emerald-700",
              isWarning && "text-amber-700",
              isFail && "text-rose-700"
            )}>{stats.cpk.toFixed(3)}</div>
            <div className={cn(
              "text-[11px] font-bold uppercase tracking-tight mt-1",
              isPass && "text-emerald-600",
              isWarning && "text-amber-600",
              isFail && "text-rose-600"
            )}>
              {isPass && "Excellent / Optimized"}
              {isWarning && "Caution / Monitoring"}
              {isFail && "Critical / Low Capability"}
            </div>
          </div>
          <div className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded text-white",
            isPass && "bg-emerald-500",
            isWarning && "bg-amber-500",
            isFail && "bg-rose-500"
          )}>
            {isPass ? "PASS" : isWarning ? "WARN" : "FAIL"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

