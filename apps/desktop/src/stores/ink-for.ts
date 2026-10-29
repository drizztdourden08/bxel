/* @layer renderer-app @kind logic */
import type { DrawingSettings, InkKind } from './drawing-store.type';

const inkFor = (drawing: Pick<DrawingSettings, 'inks'>, tool: string): InkKind => drawing.inks[tool] ?? 'normal';

export { inkFor };
