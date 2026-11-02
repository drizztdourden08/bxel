/* @layer renderer-app @kind logic */
import { readPaletteFile } from '../palette-source/read-palette-file';
import type { ImportSource } from './palette-import.type';

const textOf = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const parsed = (json: string): Record<string, unknown> | null => {
  try {
    const data: unknown = JSON.parse(json);
    return typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};

const readLospec = (json: string): ImportSource | null => {
  const data = parsed(json);
  if (!data || !Array.isArray(data.colors)) return null;
  const lines = data.colors.filter((each): each is string => typeof each === 'string').join('\n');
  const read = readPaletteFile(new TextEncoder().encode(lines), 'lospec.hex');
  if (!read.ok) return null;
  const author = textOf(data.author);
  return { name: textOf(data.name) || read.palette.name, colors: read.palette.colors, ...(author === '' ? {} : { author }) };
};

export { readLospec };
