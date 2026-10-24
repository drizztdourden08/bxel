/* @layer core @kind logic */
import { boolOf } from './bool-of';
import { listOf } from './list-of';
import { numberOf } from './number-of';
import { recOf } from './rec-of';
import { textOf } from './text-of';
import type { TiledProperties } from './tiled.type';

const typed = (type: string, value: unknown): string | number | boolean | null => {
  if (type === 'bool') return boolOf(value, false);
  if (type === 'int' || type === 'float') return numberOf(value, 0);
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : null;
};

const readProperties = (value: unknown): TiledProperties => {
  const found: Record<string, string | number | boolean> = {};
  for (const entry of listOf(value)) {
    const item = recOf(entry);
    const name = textOf(item['name'], '');
    const read = typed(textOf(item['type'], 'string'), item['value']);
    if (name !== '' && read !== null) found[name] = read;
  }
  return found;
};

export { readProperties };
