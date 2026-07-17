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
    <div className="bg-surface-card-dark rounded-[12px] border border-surface-elevated-dark p-6 flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Process Distribution & Tolerance</h3>
        <div className="flex gap-5 text-[10px]">
          <div className="flex items-center gap-1.5 text-muted-gray font-bold uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 opacity-80"></span> Actual Data
          </div>
          <div className="flex items-center gap-1.5 text-muted-gray font-bold uppercase">
            <span className="w-2.5 h-0.5 bg-trading-down border-dashed"></span> Spec Limit
          </div>
        </div>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2b3139" />
            <XAxis 
              dataKey="bin" 
              fontSize={9} 
              tickMargin={12}
              stroke="#707a8a"
              fontFamily="JetBrains Mono"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              fontSize={9}
              stroke="#707a8a"
              axisLine={false}
              tickLine={false}
              fontFamily="JetBrains Mono"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e2329', borderRadius: '8px', border: '1px solid #2b3139', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', fontSize: '10px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ fill: '#2b3139' }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isOut ? '#f6465d' : '#FCD535'} 
                  fillOpacity={0.9}
                />
              ))}
            </Bar>
            <ReferenceLine 
              x={usl.toFixed(3)} 
              stroke="#f6465d" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              label={{ value: `USL ${usl}`, position: 'top', fill: '#f6465d', fontSize: 9, fontWeight: 'bold' }} 
            />
            <ReferenceLine 
              x={lsl.toFixed(3)} 
              stroke="#f6465d" 
              strokeWidth={2}
              strokeDasharray="4 4" 
              label={{ value: `LSL ${lsl}`, position: 'top', fill: '#f6465d', fontSize: 9, fontWeight: 'bold' }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

