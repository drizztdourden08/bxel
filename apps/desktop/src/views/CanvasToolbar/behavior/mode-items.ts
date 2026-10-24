/* @layer renderer-app @kind logic */
import type { ToolbarChoice, ToolbarItem } from '@drizztdourden08/tessera';
import { backToSheet } from '../../../sheet/back-to-sheet';
import { MIN_SHEET_SPRITES, SHEET_TEXT } from '../../../sheet/sheet.constants';
import { switchMode } from '../../../sheet/switch-mode';
import { toggleBroadcast } from '../../../sheet/toggle-broadcast';
import type { SpriteMode } from '../../../stores/sprite-store.type';
import { buttonItem, choose, hintChoice, toggleItem } from '../../../toolbar-items';
import { BACK_HINT, CANVAS_TEXT, MODE_HINTS, MODE_ICONS, MODE_ORDER, PAINT_ALL_HINT } from '../CanvasToolbar.constants';
import type { ModeKeys, ModeModel } from '../CanvasToolbar.type';

const modeReason = (mode: SpriteMode, bar: ModeModel): string | false => {
  if (bar.previewing) return SHEET_TEXT.modePreviewOff;
  return mode === 'sheet' && bar.total < MIN_SHEET_SPRITES ? SHEET_TEXT.modeSheetOff : false;
};

const modeChoice = (mode: SpriteMode, bar: ModeModel, keys: ModeKeys): ToolbarChoice => {
  const choice = hintChoice(mode, MODE_ICONS[mode], MODE_HINTS[mode], keys[mode]);
  const reason = modeReason(mode, bar);
  return reason === false ? choice : { ...choice, disabled: true, description: reason };
};

const modeItems = (bar: ModeModel, keys: ModeKeys): ToolbarItem[] => [
  {
    kind: 'group',
    id: 'mode',
    label: SHEET_TEXT.mode,
    description: CANVAS_TEXT.modeDescription,
    disabled: !bar.present,
    value: bar.mode,
    choices: MODE_ORDER.map((mode) => modeChoice(mode, bar, keys)),
    onChange: choose(MODE_ORDER, switchMode),
  },
  ...(bar.isolated ? [buttonItem({ id: 'back', icon: 'arrow-left', hint: BACK_HINT, caption: CANVAS_TEXT.backCaption, onSelect: backToSheet })] : []),
  ...(bar.canBroadcast
    ? [toggleItem({ id: 'paint-all', icon: 'users', hint: PAINT_ALL_HINT, caption: CANVAS_TEXT.paintAllCaption, pressed: bar.broadcast, onChange: toggleBroadcast })]
    : []),
];

export { modeItems };
