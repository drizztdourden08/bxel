/* @layer renderer-app @kind logic */
import type { Layer, Sprite } from '@bxel/document';
import { lockKindOf } from '../editor/layer-lock';
import type { SheetLayerRow } from './sheet.type';

const keyOf = (name: string): string => name.toLowerCase();

const found = (sprites: readonly Sprite[], key: string): Layer[] =>
  sprites.flatMap((sprite) => sprite.layers.filter((layer) => keyOf(layer.name) === key));

/** Every layer name in the given sprites, top layer first, with how many sprites carry it. */
const sheetLayerRows = (sprites: readonly Sprite[]): SheetLayerRow[] => {
  const names = new Map<string, string>();
  for (const sprite of sprites) {
    for (const layer of [...sprite.layers].reverse()) if (!names.has(keyOf(layer.name))) names.set(keyOf(layer.name), layer.name);
  }
  return [...names].map(([key, name]) => {
    const layers = found(sprites, key);
    const kinds = new Set(layers.map(lockKindOf));
    return {
      name,
      carriers: layers.length,
      total: sprites.length,
      visible: layers.every((layer) => layer.visible),
      mixedVisible: new Set(layers.map((layer) => layer.visible)).size > 1,
      lock: kinds.size === 1 ? (layers[0] ? lockKindOf(layers[0]) : 'none') : 'none',
      mixedLock: kinds.size > 1,
      colour: layers.find((layer) => layer.colour !== undefined)?.colour ?? null,
    };
  });
};

export { sheetLayerRows };
