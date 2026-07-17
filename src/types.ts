/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SPCData {
  [key: string]: number | string;
}

export interface StatsResult {
  n: number;
  mean: number;
  stdDev: number;
  max: number;
  min: number;
  range: number;
  cp: number;
  cpk: number;
  defectRate: number;
  judgement: 'Pass' | 'Warning' | 'Fail';
}

export interface HistogramData {
  bin: string;
  count: number;
  isOut: boolean;
}
