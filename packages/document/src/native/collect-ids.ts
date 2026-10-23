/* @layer core @kind logic */
import type { DocumentJson, SpriteJson } from './document-json.type';

type IdSite = { readonly id: string; readonly path: string };

const at = (id: string, path: string): IdSite => ({ id, path });

const spriteIds = (sprite: SpriteJson, base: string): readonly IdSite[] => [
  at(sprite.id, base),
  ...sprite.layers.map((layer, index) => at(layer.id, `${base}.layers[${index}]`)),
  ...sprite.frames.map((frame, index) => at(frame.id, `${base}.frames[${index}]`)),
  ...sprite.tags.map((tag, index) => at(tag.id, `${base}.tags[${index}]`)),
  ...sprite.slices.map((slice, index) => at(slice.id, `${base}.slices[${index}]`)),
  ...sprite.celIds.map((id, index) => at(id, `${base}.celIds[${index}]`)),
];

const collectIds = (document: DocumentJson): readonly IdSite[] => [
  at(document.id, '$'),
  ...document.banks.flatMap((bank, index) => [
    at(bank.id, `$.banks[${index}]`),
    ...bank.slots.map((slot, slotIndex) => at(slot.id, `$.banks[${index}].slots[${slotIndex}]`)),
    ...bank.ramps.map((ramp, rampIndex) => at(ramp.id, `$.banks[${index}].ramps[${rampIndex}]`)),
  ]),
  ...document.sprites.flatMap((sprite, index) => spriteIds(sprite, `$.sprites[${index}]`)),
  ...document.sheets.map((sheet, index) => at(sheet.id, `$.sheets[${index}]`)),
  ...document.presets.map((preset, index) => at(preset.id, `$.presets[${index}]`)),
  ...document.tilesets.flatMap((tileset, index) => [
    at(tileset.id, `$.tilesets[${index}]`),
    ...tileset.tiles.map((tile, tileIndex) => at(tile.id, `$.tilesets[${index}].tiles[${tileIndex}]`)),
  ]),
  ...document.tilemaps.flatMap((tilemap, index) => [
    at(tilemap.id, `$.tilemaps[${index}]`),
    ...tilemap.layers.map((layer, layerIndex) => at(layer.id, `$.tilemaps[${index}].layers[${layerIndex}]`)),
  ]),
];

export { collectIds };
