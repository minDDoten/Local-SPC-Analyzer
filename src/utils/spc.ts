/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StatsResult, HistogramData } from '../types';

export function calculateSPC(data: number[], usl: number, lsl: number): StatsResult {
  const n = data.length;
  if (n === 0) {
    return { n: 0, mean: 0, stdDev: 0, max: 0, min: 0, range: 0, cp: 0, cpk: 0, defectRate: 0, judgement: 'Fail' };
  }

  const mean = data.reduce((a, b) => a + b, 0) / n;
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const cp = (usl - lsl) / (6 * stdDev);
  const cpu = (usl - mean) / (3 * stdDev);
  const cpl = (mean - lsl) / (3 * stdDev);
  const cpk = Math.min(cpu, cpl);

  // Simple defect rate calculation based on normal distribution approximation (Z-score)
  // For actual production, we count spec-outs in the sample
  const outOfSpecs = data.filter(v => v > usl || v < lsl).length;
  const defectRate = (outOfSpecs / n) * 100;

  let judgement: 'Pass' | 'Warning' | 'Fail' = 'Fail';
  if (cpk >= 1.33) judgement = 'Pass';
  else if (cpk >= 1.0) judgement = 'Warning';

  return { n, mean, stdDev, max, min, range, cp, cpk, defectRate, judgement };
}

export function generateHistogram(data: number[], usl: number, lsl: number, bins: number = 15): HistogramData[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const binWidth = range / bins;

  const histogram = Array.from({ length: bins }, (_, i) => {
    const start = min + i * binWidth;
    const end = start + binWidth;
    const count = data.filter(v => v >= start && v < (i === bins - 1 ? end + 0.0001 : end)).length;
    
    return {
      bin: start.toFixed(3),
      count,
      isOut: start < lsl || end > usl
    };
  });

  return histogram;
}

export function generateVirtualData(n: number = 50, mean: number = 10.02, stdDev: number = 0.015): number[] {
  return Array.from({ length: n }, () => {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  });
}
