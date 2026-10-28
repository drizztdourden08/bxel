/* @layer renderer-app @kind logic */
import type { ToolPreset } from '../presets/tool-preset.type';
import type { OptionValue } from './tool-options.type';

const isRecord = (raw: unknown): raw is Record<string, unknown> => typeof raw === 'object' && raw !== null && !Array.isArray(raw);

const isValue = (raw: unknown): raw is OptionValue => typeof raw === 'number' || typeof raw === 'string' || typeof raw === 'boolean';

const parseOptionValues = (raw: unknown): Record<string, OptionValue> => {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, OptionValue] => isValue(entry[1])));
};

const parsePreset = (raw: unknown): ToolPreset[] => {
  if (!isRecord(raw)) return [];
  const { id, name, member, fields } = raw;
  if (typeof id !== 'string' || typeof name !== 'string' || typeof member !== 'string') return [];
  return [{ id, name, member, fields: parseOptionValues(fields) }];
};

const parsePresets = (raw: unknown): ToolPreset[] => (Array.isArray(raw) ? raw.flatMap(parsePreset) : []);

export { isRecord, parseOptionValues, parsePresets };
