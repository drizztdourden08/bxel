/* @layer core @kind logic */
import { scaleSprite } from './scale-sprite';
import type { SheetMetadata } from './sheet-metadata.type';

const scaleMetadata = (metadata: SheetMetadata, factor: number): SheetMetadata => ({
  image: metadata.image,
  width: metadata.width * factor,
  height: metadata.height * factor,
  scale: factor,
  sprites: metadata.sprites.map((sprite) => scaleSprite(sprite, factor)),
});

export { scaleMetadata };
