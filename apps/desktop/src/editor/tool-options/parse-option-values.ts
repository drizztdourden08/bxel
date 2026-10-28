/* @layer renderer-app @kind logic */
import { isRecord } from './is-record';
import type { OptionValue } from './tool-options.type';

const isValue = (raw: unknown): raw is OptionValue => typeof raw === 'number' || typeof raw === 'string' || typeof raw === 'boolean';

const parseOptionValues = (raw: unknown): Record<string, OptionValue> => {
  if (!isRecord(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter((entry): entry is [string, OptionValue] => isValue(entry[1])));
};

export { parseOptionValues };
