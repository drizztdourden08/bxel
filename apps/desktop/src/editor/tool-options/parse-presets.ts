/* @layer renderer-app @kind logic */
import type { ToolPreset } from '../presets/tool-preset.type';
import { isRecord } from './is-record';
import { parseOptionValues } from './parse-option-values';

const parsePreset = (raw: unknown): ToolPreset[] => {
  if (!isRecord(raw)) return [];
  const { id, name, member, fields } = raw;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof member !== 'string') return [];
  return [{ id, name, member, fields: parseOptionValues(fields) }];
};

const parsePresets = (raw: unknown): ToolPreset[] => (Array.isArray(raw) ? raw.flatMap(parsePreset) : []);

export { parsePresets };
