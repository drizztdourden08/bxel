/* @layer core @kind logic */
import { JSON_INDENT } from './asset-container.constants';

const byKey = ([left]: readonly [string, unknown], [right]: readonly [string, unknown]): number =>
  left < right ? -1 : 1;

const sortKeys = (_key: string, value: unknown): unknown =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value).sort(byKey))
    : value;

const canonicalJson = (value: unknown): string => JSON.stringify(value, sortKeys, JSON_INDENT);

export { canonicalJson };
