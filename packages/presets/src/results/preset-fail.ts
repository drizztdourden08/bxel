/* @layer core @kind logic */
import type { PresetErrorCode, PresetFailure } from './preset-result.type';

const presetFail = (
  code: PresetErrorCode,
  message: string,
  issues: readonly string[] = [],
): PresetFailure => ({ ok: false, code, message, issues });

export { presetFail };
