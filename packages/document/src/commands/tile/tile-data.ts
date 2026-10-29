/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import type { FieldValue, Tile, Tileset } from '../../model/tilemap.type';
import { fieldValueIssue } from '../../read/field-value-issue';
import { requireTile } from '../../read/require-tile';
import { tileDataSchema } from '../../schema/tile-data-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

type DataChange = Readonly<Record<string, FieldValue | null>>;

const checkData = (tileset: Tileset, change: DataChange): void => {
  for (const [name, value] of Object.entries(change)) {
    const field = (tileset.fields ?? []).find((each) => each.name === name);
    const path = `options.data.${name}`;
    if (!field) throw fail(ERROR_CODE.INVALID_OPTION, `The tileset has no field "${name}".`, { path });
    const issue = value === null ? null : fieldValueIssue(field, value);
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path });
  }
};

const mergedData = (tile: Tile, change: DataChange): Tile['data'] => {
  const next: Record<string, FieldValue> = { ...tile.data };
  for (const [name, value] of Object.entries(change)) {
    if (value === null) delete next[name];
    else next[name] = value;
  }
  return Object.keys(next).length > 0 ? next : undefined;
};

type Plain = { type?: string | null; probability?: number | null; turns?: Tile['turns'] | null };

const applied = (tile: Tile, plain: Plain, change: DataChange | undefined): Tile => {
  const { type, probability, turns, data, ...rest } = tile;
  const nextType = plain.type === undefined ? type : (plain.type ?? undefined);
  const nextProbability = plain.probability === undefined ? probability : (plain.probability ?? undefined);
  const nextTurns = plain.turns === undefined ? turns : (plain.turns ?? undefined);
  const nextData = change ? mergedData(tile, change) : data;
  return {
    ...rest,
    ...(nextType ? { type: nextType } : {}),
    ...(nextProbability !== undefined ? { probability: nextProbability } : {}),
    ...(nextTurns ? { turns: nextTurns } : {}),
    ...(nextData ? { data: nextData } : {}),
  };
};

const tileData = defineCommand({
  name: COMMAND_NAME.tileData,
  scope: 'none',
  schema: tileDataSchema,
  run: (draft, input) => {
    const { keys, data, ...plain } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    for (const key of keys) requireTile(tileset, key);
    if (data) checkData(tileset, data);
    const picked = new Set(keys);
    updateTileset(draft, tileset.id, (current) => ({
      ...current,
      tiles: current.tiles.map((tile) => (picked.has(tile.key) ? applied(tile, plain, data) : tile)),
    }));
  },
});

export { tileData };
