/* @layer renderer-app @kind hook */
import type { SpriteId } from '@bxel/document';
import { NO_SPRITES } from '../../../export/export.constants';

const useSelectedSprites = (): readonly SpriteId[] => NO_SPRITES;

export { useSelectedSprites };
