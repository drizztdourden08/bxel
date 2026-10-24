/* @layer core @kind types */
import type { AREA_CLASH_CODE } from '../results/preset-error.constants';

type AreaClashCode = (typeof AREA_CLASH_CODE)[keyof typeof AREA_CLASH_CODE];

type AreaBank = { readonly cap: number };

type AreaRect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

type AreaClash = AreaRect & {
  readonly code: AreaClashCode;
  readonly used: number;
  readonly limit: number;
  readonly tier: 'warn' | 'advisory';
};

export type { AreaBank, AreaClash, AreaClashCode, AreaRect };
