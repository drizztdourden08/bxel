/* @layer core @kind constants */
import type { TileField } from '../model/tilemap.type';
import type { FieldRule } from './field-value-issue.type';

const COLOUR = /^#[0-9a-fA-F]{6}$/;

const FIELD_RULES: Readonly<Partial<Record<TileField['kind'], FieldRule>>> = {
  bool: (field, value) => (typeof value === 'boolean' ? null : `Field "${field.name}" is on or off.`),
  int: (field, value) => (Number.isInteger(value) ? null : `Field "${field.name}" is a whole number.`),
  number: (field, value) => (typeof value === 'number' ? null : `Field "${field.name}" is a number.`),
  colour: (field, value) => (typeof value === 'string' && COLOUR.test(value) ? null : `Field "${field.name}" is a colour like #3366cc.`),
};

export { FIELD_RULES };
