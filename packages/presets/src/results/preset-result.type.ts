/* @layer core @kind types */
import type { PRESET_ERROR_CODE } from './preset-error.constants';

type PresetErrorCode = (typeof PRESET_ERROR_CODE)[keyof typeof PRESET_ERROR_CODE];

type PresetFailure = {
  readonly ok: false;
  readonly code: PresetErrorCode;
  readonly message: string;
  readonly issues: readonly string[];
};

type PresetResult<T> = { readonly ok: true; readonly value: T } | PresetFailure;

export type { PresetErrorCode, PresetFailure, PresetResult };
