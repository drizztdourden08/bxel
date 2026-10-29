/* @layer core @kind logic */
import type { FieldValue, TileField } from '../model/tilemap.type';
import { FIELD_RULES } from './field-value-issue.constants';

const fieldValueIssue = (field: TileField, value: FieldValue): string | null => {
  const rule = FIELD_RULES[field.kind];
  if (rule) return rule(field, value);
  if (typeof value !== 'string') return `Field "${field.name}" is text.`;
  if (field.kind === 'choice' && !(field.choices ?? []).includes(value)) return `Field "${field.name}" is one of ${(field.choices ?? []).join(', ')}.`;
  return null;
};

export { fieldValueIssue };
