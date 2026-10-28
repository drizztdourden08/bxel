/* @layer renderer-app @kind logic */
import type { LayerBarAction, LayerStackModel } from '../LayerStack.type';
import { LAYER_BAR_HINTS, LAYER_STACK_TEXT } from '../LayerStack.constants';

const LAST_LAYER = 'A list keeps at least one layer.';
const BOTTOM_LAYER = 'There is no layer below to merge into.';

/** The buttons of the bar under the list, each with the reason it cannot run right now, or null. */
const barActions = (model: LayerStackModel): LayerBarAction[] => {
  const { actions, rows, activeId } = model;
  const at = rows.findIndex((row) => row.id === activeId);
  return [
    { id: 'duplicate', icon: 'copy', hint: LAYER_BAR_HINTS.duplicate, run: actions.duplicate, reason: at < 0 ? LAYER_STACK_TEXT.noSprite : null },
    { id: 'merge', icon: 'arrow-down', hint: LAYER_BAR_HINTS.merge, run: actions.merge, reason: at < 0 || at === rows.length - 1 ? BOTTOM_LAYER : null },
    { id: 'remove', icon: 'trash-2', hint: LAYER_BAR_HINTS.remove, run: actions.remove, reason: rows.length < 2 ? LAST_LAYER : null },
  ];
};

export { barActions };
