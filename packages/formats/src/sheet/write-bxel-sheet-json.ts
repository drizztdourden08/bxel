/* @layer core @kind logic */
import { SHEET_JSON } from './sheet-json.constants';
import type { SheetMetadata } from './sheet-metadata.type';
import { writeBxelSprite } from './write-bxel-sprite';

const hasFacings = (metadata: SheetMetadata): boolean =>
  metadata.sprites.some((sprite) => sprite.tags.some((tag) => tag.facing !== undefined || tag.mirrorOf !== undefined));

const writeBxelSheetJson = (metadata: SheetMetadata): string =>
  `${JSON.stringify(
    {
      format: SHEET_JSON.FORMAT,
      version: hasFacings(metadata) ? SHEET_JSON.ANIMATION_VERSION : SHEET_JSON.VERSION,
      image: metadata.image,
      size: { w: metadata.width, h: metadata.height },
      scale: metadata.scale,
      sprites: metadata.sprites.map(writeBxelSprite),
    },
    null,
    2,
  )}\n`;

export { writeBxelSheetJson };
