/* @layer renderer-app @kind logic */
import type { TileField, TileFieldKind } from '@bxel/document';
import { FIELD_DEFAULTS } from '../TilesetPanel.constants';

const newField = (name: string, kind: TileFieldKind, choices: string): TileField | null => {
  const trimmed = name.trim();
  if (trimmed === '') return null;
  if (kind !== 'choice') return { name: trimmed, kind, default: FIELD_DEFAULTS[kind] };
  const list = [...new Set(choices.split(',').map((choice) => choice.trim()).filter((choice) => choice !== ''))];
  const [first] = list;
  return first === undefined ? null : { name: trimmed, kind, default: first, choices: list };
};

export { newField };
