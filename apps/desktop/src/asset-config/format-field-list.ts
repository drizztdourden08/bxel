/* @layer renderer-app @kind logic */
import type { TileField } from '@bxel/document';

const formatField = (field: TileField): string =>
  field.kind === 'choice' ? `${field.name}:choice(${(field.choices ?? []).join('|')})` : `${field.name}:${field.kind}`;

const formatFieldList = (fields: readonly TileField[]): string => fields.map(formatField).join(', ');

export { formatFieldList };
