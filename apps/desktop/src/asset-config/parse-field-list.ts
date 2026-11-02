/* @layer renderer-app @kind logic */
import type { TileField, TileFieldKind } from '@bxel/document';
import { ENTRY } from './parse-field-list.constants';
import { FIELD_DEFAULTS } from '../views/TilesetPanel/behavior/tileset-fields.constants';

const choicesOf = (raw: string | undefined): string[] => [...new Set((raw ?? '').split('|').map((choice) => choice.trim()).filter((choice) => choice !== ''))];

const sameField = (old: TileField | undefined, name: string, kind: TileFieldKind, choices: readonly string[]): TileField | null => {
  if (old?.kind !== kind) return null;
  const kept = old.choices ?? [];
  return kind !== 'choice' || (kept.length === choices.length && kept.every((choice, at) => choice === choices[at])) ? { ...old, name } : null;
};

const entryField = (entry: string, now: readonly TileField[]): TileField | null => {
  const match = ENTRY.exec(entry.trim());
  if (!match) return null;
  const name = (match[1] ?? '').trim();
  const kind = (match[2] ?? '').replace(/\(.*$/, '') as TileFieldKind;
  const choices = choicesOf(match[3]);
  const kept = sameField(now.find((field) => field.name === name), name, kind, choices);
  if (kept) return kept;
  if (kind !== 'choice') return { name, kind, default: FIELD_DEFAULTS[kind] };
  const [first] = choices;
  return first === undefined ? null : { name, kind, default: first, choices };
};

const parseFieldList = (text: string, now: readonly TileField[]): readonly TileField[] | null => {
  const entries = text.split(/[,\n]/);
  const parsed = entries.flatMap((entry) => (entry.trim() === '' ? [] : [entryField(entry, now)]));
  if (parsed.some((field) => field === null)) return null;
  const fields = parsed as TileField[];
  return new Set(fields.map((field) => field.name)).size === fields.length ? fields : null;
};

export { parseFieldList };
