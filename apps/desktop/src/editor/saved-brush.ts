/* @layer renderer-app @kind logic */
import type { CustomBrush } from '@bxel/document';
import { savedBrushes } from './saved-brushes';

const savedBrush = (id: string | null): CustomBrush | null => (id === null ? null : (savedBrushes().find((brush) => brush.id === id) ?? null));

export { savedBrush };
