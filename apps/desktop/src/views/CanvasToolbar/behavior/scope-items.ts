/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { backToSheet } from '../../../sheet/back-to-sheet';
import { toggleBroadcast } from '../../../sheet/toggle-broadcast';
import { buttonItem, toggleItem } from '../../../toolbar-items';
import { BACK_HINT, CANVAS_TEXT, PAINT_ALL_HINT } from '../CanvasToolbar.constants';
import type { ScopeModel } from '../CanvasToolbar.type';

const scopeItems = (bar: ScopeModel): ToolbarItem[] => [
  ...(bar.isolated ? [buttonItem({ id: 'back', icon: 'arrow-left', hint: BACK_HINT, caption: CANVAS_TEXT.backCaption, onSelect: backToSheet })] : []),
  ...(bar.canBroadcast
    ? [toggleItem({ id: 'paint-all', icon: 'users', hint: PAINT_ALL_HINT, caption: CANVAS_TEXT.paintAllCaption, pressed: bar.broadcast, onChange: toggleBroadcast })]
    : []),
];

export { scopeItems };
