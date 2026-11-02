/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { assetDragPreview } from '../../../asset-drag/asset-drag-preview';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import type { SelectionModel } from '../../../panel-browser/browser-state.type';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { exportable } from './exportable';

const assetOf = (item: BrowserItem): DragAsset => ({ id: item.row?.id ?? item.key, kind: item.kind, assetId: item.row?.assetId ?? null, path: item.path });

const useAssetDragOut = (ref: RefObject<HTMLElement | null>, item: BrowserItem, selection: Pick<SelectionModel, 'keys' | 'targets'>, held?: () => boolean): void =>
  useDragSource(ref, {
    type: ASSET_DRAG,
    preview: assetDragPreview,
    disabled: () => !exportable(item) || (held?.() ?? false),
    payload: () => (selection.keys.has(item.key) ? selection.targets : [item]).filter(exportable).map(assetOf),
  });

export { useAssetDragOut };
