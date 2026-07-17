/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { HistogramData } from '../types';

interface SPCChartProps {
  data: HistogramData[];
  usl: number;
  lsl: number;
}

export const SPCChart: React.FC<SPCChartProps> = ({ data, usl, lsl }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Process Distribution & Tolerance</h3>
        <div className="flex gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-500 opacity-80"></span> Actual Data
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="w-2 h-0.5 bg-red-400 border-dashed"></span> Spec Limit
          </div>
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="bin" 
              fontSize={9} 
              tickMargin={8}
              stroke="#94a3b8"
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              fontSize={9}
              stroke="#94a3b8"
              axisLine={false}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isOut ? '#f87171' : '#60a5fa'} 
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
            <ReferenceLine 
              x={usl.toFixed(3)} 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              label={{ value: `USL ${usl}`, position: 'top', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} 
            />
            <ReferenceLine 
              x={lsl.toFixed(3)} 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              label={{ value: `LSL ${lsl}`, position: 'top', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

