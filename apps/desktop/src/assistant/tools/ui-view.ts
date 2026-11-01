/* @layer renderer-app @kind logic */
import { currentContext } from '../../ui-context/current-context';
import { evaluate } from '../../ui-context/evaluate';
import type { BxelContext } from '../../ui-context/bxel-context.type';
import { UI_WIDGET_IDS, UI_TOOLBAR_IDS } from './ui-view.constants';

const stateOf = (id: string, context: BxelContext) => evaluate(id, context);

const uiView = (context: BxelContext = currentContext()) => ({
  workspace: context.fileType,
  widgets: UI_WIDGET_IDS.map((id) => ({ id, ...stateOf(`widget.${id}`, context) })),
  toolbars: UI_TOOLBAR_IDS.map((id) => ({ id, state: stateOf(`toolbar.${id}`, context).state })),
  kindMenu: context.fileType === 'none' ? null : { kind: context.fileType, state: stateOf(`menu.kind.${context.fileType}`, context).state },
});

export { uiView };
