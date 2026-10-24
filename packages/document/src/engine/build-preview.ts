/* @layer core @kind logic */
import type { CelChange, ChangeSet, PreviewCel, PreviewData } from '../commands/result.type';
import type { BankId } from '../model/ids.type';
import type { Artwork } from '../model/artwork.type';
import type { Sprite } from '../model/sprite.type';
import { readRect } from '../pixels/read-rect';
import { findSprite } from '../read/find-sprite';
import { colorUse } from './color-use';

const previewCel = (sprite: Sprite, change: CelChange, previewPixels: number): PreviewCel => {
  const area = change.rect.width * change.rect.height;
  const source = sprite.cels[change.celId]?.pixels;
  const pixels = source && area <= previewPixels ? readRect(source, sprite.width, change.rect) : new Uint8Array(0);
  return { ...change, pixels };
};

const buildPreview = ({
  artwork,
  changes,
  previewPixels,
}: {
  artwork: Artwork;
  changes: ChangeSet;
  previewPixels: number;
}): PreviewData => {
  const cels: PreviewCel[] = [];
  const bankIds = new Set<BankId>();
  for (const change of changes.sprites) {
    const sprite = findSprite(artwork, change.id);
    if (!sprite || change.cels.length === 0) continue;
    bankIds.add(sprite.bankId);
    cels.push(...change.cels.map((celChange) => previewCel(sprite, celChange, previewPixels)));
  }
  const truncated = cels.some((cel) => cel.pixels.length === 0);
  return { cels, colorUse: colorUse(artwork, bankIds), truncated };
};

export { buildPreview };
