/* @layer renderer-app @kind logic */
import { hasActiveDocument } from '../files/has-active-document';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { surfaceOf } from './surface-of';
import type { Surface } from './surface.type';

const currentSurface = (): Surface => surfaceOf(hasActiveDocument(), useSpriteStore.getState().mode, useTilemapStore.getState().editMode);

export { currentSurface };
