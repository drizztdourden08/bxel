/* @layer renderer-app @kind logic */
import type { LayerBarAction, LayerStackModel } from '../LayerStack.type';
import { LAYER_BAR_HINTS, LAYER_REASONS, LAYER_STACK_TEXT } from '../LayerStack.constants';

const barActions = (model: LayerStackModel): LayerBarAction[] => {
  const { actions, rows, activeId } = model;
  const at = rows.findIndex((row) => row.id === activeId);
  return [
    { id: 'duplicate', icon: 'copy', hint: LAYER_BAR_HINTS.duplicate, run: actions.duplicate, reason: at < 0 ? LAYER_STACK_TEXT.noSprite : null },
    { id: 'merge', icon: 'arrow-down', hint: LAYER_BAR_HINTS.merge, run: actions.merge, reason: at < 0 || at === rows.length - 1 ? LAYER_REASONS.bottom : null },
    { id: 'remove', icon: 'trash-2', hint: LAYER_BAR_HINTS.remove, run: actions.remove, reason: rows.length < 2 ? LAYER_REASONS.last : null },
  ];
};

export { barActions };
