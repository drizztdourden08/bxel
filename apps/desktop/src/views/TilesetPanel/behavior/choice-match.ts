/* @layer renderer-app @kind logic */
import type { Tile, TileField } from '@bxel/document';
import type { ChoiceFilter } from '../../../stores/tileset-view-store.type';

const valueOf = (tile: Tile, name: string, fields: readonly TileField[]): string =>
  String(tile.data?.[name] ?? fields.find((field) => field.name === name)?.default ?? '');

const choiceMatches = (tile: Tile, choices: readonly ChoiceFilter[], fields: readonly TileField[]): boolean => {
  const names = new Set(choices.map((choice) => choice.field));
  return [...names].every((name) => {
    const have = valueOf(tile, name, fields);
    return choices.some((choice) => choice.field === name && choice.value === have);
  });
};

export { choiceMatches };
