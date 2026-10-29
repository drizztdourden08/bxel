/* @layer renderer-app @kind logic */
import type { SavedBrush } from '@bxel/document';
import { savedBrushes } from './saved-brushes';

const savedBrush = (id: string | null): SavedBrush | null => (id === null ? null : (savedBrushes().find((brush) => brush.id === id) ?? null));

export { savedBrush };
