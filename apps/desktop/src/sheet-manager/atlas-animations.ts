/* @layer renderer-app @kind logic */
import { sheetAnimationItems } from '../sheet/sheet-animation-items';
import { ATLAS_ROW_GAP } from './atlas-model.constants';
import type { AtlasAnimation, AtlasInput, AtlasModel } from './manager.type';

const widthOf = (item: { images: readonly { width: number }[]; spacing: number }): number =>
  item.images.reduce((sum, image, index) => sum + image.width + (index === 0 ? 0 : item.spacing), 0);

const heightOf = (item: { images: readonly { height: number }[] }): number => Math.max(0, ...item.images.map((image) => image.height));

const atlasAnimations = (model: AtlasModel, input: AtlasInput): AtlasModel => {
  const items = sheetAnimationItems(input.artwork, input.sheet).filter((item) => item.images.length > 0);
  if (items.length === 0) return model;
  const manual = input.sheet.layout.kind === 'manual';
  let nextY = model.height === 0 ? 0 : model.height + ATLAS_ROW_GAP;
  const placed = items.map((item): AtlasAnimation => {
    const y = manual ? item.at.y : nextY;
    nextY = Math.max(nextY, y + heightOf(item) + ATLAS_ROW_GAP);
    return { name: item.name, x: manual ? item.at.x : 0, y, spacing: item.spacing, images: item.images };
  });
  const width = Math.max(model.width, ...placed.map((item, index) => item.x + widthOf(items[index] ?? item)));
  const height = Math.max(model.height, ...placed.map((item, index) => item.y + heightOf(items[index] ?? item)));
  return { ...model, width, height, animations: placed };
};

export { atlasAnimations };
