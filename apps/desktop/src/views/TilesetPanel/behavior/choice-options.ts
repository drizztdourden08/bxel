/* @layer renderer-app @kind logic */
import type { Tileset } from '@bxel/document';
import type { ChoiceOption } from './choice-options.type';

const choiceOptions = (tileset: Tileset): readonly ChoiceOption[] =>
  (tileset.fields ?? []).flatMap((field) =>
    field.kind === 'choice' ? (field.choices ?? []).map((value) => ({ field: field.name, value, label: `${field.name}: ${value}` })) : [],
  );

export { choiceOptions };
