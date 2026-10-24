/* @layer core @kind logic */
import type { ResolvedCel, SpriteId } from '@bxel/document';
import { uniqueCels } from './unique-cels';

const spriteCels = (cels: readonly ResolvedCel[], spriteId: SpriteId): ResolvedCel[] =>
  uniqueCels(cels.filter((cel) => cel.spriteId === spriteId));

export { spriteCels };
