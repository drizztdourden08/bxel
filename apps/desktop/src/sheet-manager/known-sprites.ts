/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';

const knownSprites = (): ReadonlySet<SpriteId> => new Set((currentArtwork()?.sprites ?? []).map((sprite) => sprite.id));

export { knownSprites };
