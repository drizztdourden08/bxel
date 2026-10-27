/* @layer core @kind logic */
import { PROTECTED_KEY_PREFIXES } from './is-protected-setting-key.constants';

const isProtectedSettingKey = (key: string): boolean => {
  const lower = key.trim().toLowerCase();
  return PROTECTED_KEY_PREFIXES.some((prefix) => lower.startsWith(prefix));
};

export { isProtectedSettingKey };
