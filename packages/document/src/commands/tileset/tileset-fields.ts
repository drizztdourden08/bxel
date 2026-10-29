/* @layer core @kind logic */
import { updateTileset } from '../../draft/update-tileset';
import type { FieldValue, Tile, TileField, Tileset } from '../../model/tilemap.type';
import { fieldValueIssue } from '../../read/field-value-issue';
import { tilesetFieldsSchema } from '../../schema/tileset-fields-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickTileset } from '../tilemap/pick-tileset';

const checkFields = (fields: readonly TileField[]): void => {
  const seen = new Set<string>();
  fields.forEach((field, at) => {
    const path = `options.fields.${at}`;
    if (seen.has(field.name)) throw fail(ERROR_CODE.INVALID_OPTION, `Two fields are named "${field.name}".`, { path });
    seen.add(field.name);
    if (field.kind === 'choice' && (field.choices ?? []).length === 0) {
      throw fail(ERROR_CODE.INVALID_OPTION, `Choice field "${field.name}" needs at least one choice.`, { path });
    }
    const issue = fieldValueIssue(field, field.default);
    if (issue !== null) throw fail(ERROR_CODE.INVALID_OPTION, issue, { path: `${path}.default` });
  });
};

const keptData = (tile: Tile, fields: readonly TileField[]): Tile => {
  if (!tile.data) return tile;
  const kept: Record<string, FieldValue> = {};
  for (const [name, value] of Object.entries(tile.data)) {
    const field = fields.find((each) => each.name === name);
    if (field && fieldValueIssue(field, value) === null) kept[name] = value;
  }
  const { data: _data, ...rest } = tile;
  return Object.keys(kept).length > 0 ? { ...rest, data: kept } : rest;
};

const movedShapes = (tile: Tile, layers: readonly string[]): Tile => {
  if (!tile.shapes) return tile;
  const fallback = layers[0] ?? 'solid';
  return { ...tile, shapes: tile.shapes.map((shape) => (layers.includes(shape.layer) ? shape : { ...shape, layer: fallback })) };
};

const withFields = (current: Tileset, fields: readonly TileField[] | undefined, layers: readonly string[] | undefined): Tileset => {
  const { fields: _fields, collisionLayers: _layers, ...rest } = current;
  const nextFields = fields ?? current.fields;
  const nextLayers = layers ?? current.collisionLayers;
  return {
    ...rest,
    ...(nextFields && nextFields.length > 0 ? { fields: nextFields } : {}),
    ...(nextLayers ? { collisionLayers: nextLayers } : {}),
    tiles: current.tiles.map((tile) => movedShapes(fields ? keptData(tile, fields) : tile, nextLayers ?? ['solid'])),
  };
};

const tilesetFields = defineCommand({
  name: COMMAND_NAME.tilesetFields,
  scope: 'none',
  schema: tilesetFieldsSchema,
  run: (draft, input) => {
    const { fields, collisionLayers } = input.options;
    const tileset = pickTileset(draft, input.options.tileset);
    if (fields) checkFields(fields);
    if (collisionLayers && new Set(collisionLayers).size !== collisionLayers.length) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'Collision layer names are unique.', { path: 'options.collisionLayers' });
    }
    updateTileset(draft, tileset.id, (current) => withFields(current, fields, collisionLayers));
  },
});

export { tilesetFields };
