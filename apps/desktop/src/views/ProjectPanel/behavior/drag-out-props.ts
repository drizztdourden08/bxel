/* @layer renderer-app @kind logic */
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { SelectionModel } from '../../../panel-browser/browser-state.type';
import { SPRITE_DRAG_TYPE } from '../../../sheet/sprite-drag.constants';
import { ASSET_DRAG_TYPE } from '../../ProjectBrowser/ProjectBrowser.constants';
import type { DropEvent } from '../ProjectPanel.type';
import { exportable } from './exportable';

const payloadOf = (items: readonly BrowserItem[]): string =>
  JSON.stringify(items.map((item) => ({ id: item.row?.id ?? item.key, kind: item.kind, assetId: item.row?.assetId ?? null, path: item.path })));

const dragOutProps = (item: BrowserItem, selection: Pick<SelectionModel, 'keys' | 'targets'>): Record<string, unknown> => {
  if (!exportable(item)) return {};
  return {
    draggable: true,
    onDragStart: (event: DropEvent) => {
      const items = (selection.keys.has(item.key) ? selection.targets : [item]).filter(exportable);
      event.dataTransfer.setData(ASSET_DRAG_TYPE, payloadOf(items));
      if (item.kind === 'sprite' && item.row?.loaded === true && item.row.assetId !== null) event.dataTransfer.setData(SPRITE_DRAG_TYPE, item.row.assetId);
      event.dataTransfer.effectAllowed = 'copyMove';
    },
  };
};

export { dragOutProps };
