/* @layer core @kind logic */
import type { FieldValue, TileField } from '../model/tilemap.type';

const COLOUR = /^#[0-9a-fA-F]{6}$/;

const fieldValueIssue = (field: TileField, value: FieldValue): string | null => {
  if (field.kind === 'bool') return typeof value === 'boolean' ? null : `Field "${field.name}" is on or off.`;
  if (field.kind === 'int') return Number.isInteger(value) ? null : `Field "${field.name}" is a whole number.`;
  if (field.kind === 'number') return typeof value === 'number' ? null : `Field "${field.name}" is a number.`;
  if (field.kind === 'colour') return typeof value === 'string' && COLOUR.test(value) ? null : `Field "${field.name}" is a colour like #3366cc.`;
  if (typeof value !== 'string') return `Field "${field.name}" is text.`;
  if (field.kind === 'choice' && !(field.choices ?? []).includes(value)) return `Field "${field.name}" is one of ${(field.choices ?? []).join(', ')}.`;
  return null;
};

export { fieldValueIssue };
