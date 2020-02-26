import { ImmutableObject } from 'seamless-immutable';
import { FourSidesUnit } from 'jimu-ui';

export interface RowLayoutItemSetting {
  heightMode: 'fit' | 'fixed' | 'ratio';
  autoProps?: { height?: boolean };
  aspectRatio?: number | string;
  offsetX?: number;
  offsetY?: number;
  style: {
    alignSelf: 'flex-start' | 'flex-end' | 'center' | 'stretch',
  };
}

export interface RowConfig {
  space: number;
  style: {
    padding?: FourSidesUnit;
  };
}

export type IMRowConfig = ImmutableObject<RowConfig>;


