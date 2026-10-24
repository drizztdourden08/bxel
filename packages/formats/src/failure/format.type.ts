/* @layer core @kind types */
import type { FORMAT_ERROR_CODE } from './format-error.constants';

type FormatErrorCode = (typeof FORMAT_ERROR_CODE)[keyof typeof FORMAT_ERROR_CODE];

type FormatFailure = {
  readonly ok: false;
  readonly code: FormatErrorCode;
  readonly message: string;
};

type FormatBytesResult = { readonly ok: true; readonly bytes: Uint8Array } | FormatFailure;

export type { FormatBytesResult, FormatErrorCode, FormatFailure };
