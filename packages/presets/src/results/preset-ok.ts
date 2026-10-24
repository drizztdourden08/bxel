/* @layer core @kind logic */
import type { PresetResult } from './preset-result.type';

const presetOk = <T>(value: T): PresetResult<T> => ({ ok: true, value });

export { presetOk };
