/* @layer renderer-app @kind logic */
import { tileSizeOfSprite } from '../canvas-size/tile-size-of-sprite';
import { currentArtwork } from '../sheet/current-artwork';
import type { EditorTarget } from './editor.type';

const tileSizeOfTarget = (target: EditorTarget): { width: number; height: number } | null => tileSizeOfSprite(currentArtwork(), target.sprite);

export { tileSizeOfTarget };
