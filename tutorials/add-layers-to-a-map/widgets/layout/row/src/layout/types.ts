import { ImmutableObject } from 'jimu-core';
// import { COLS_IN_ONE_ROW } from 'jimu-layouts/common';

export const MIN_SPAN = 2;
export const TOTAL_COLS = 12;

export interface ChildRect {
  layoutId?: string;
  id: string;
  left?: number;
  width: number;
  height?: number;
}

export type IMChildRect = ImmutableObject<ChildRect>;
