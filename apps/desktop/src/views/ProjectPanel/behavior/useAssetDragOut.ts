/* @layer renderer-app @kind hook */
import { useDragSource } from '@drizztdourden08/brock-react';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { DragAsset } from '../../../asset-drag/asset-drag.type';
import type { SelectionModel } from '../../../panel-browser/browser-state.type';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { exportable } from './exportable';

const assetOf = (item: BrowserItem): DragAsset => ({ id: item.row?.id ?? item.key, kind: item.kind, assetId: item.row?.assetId ?? null, path: item.path });

const useAssetDragOut = (ref: RefObject<HTMLElement | null>, item: BrowserItem, selection: Pick<SelectionModel, 'keys' | 'targets'>): void => {
  const latest = useRef({ item, selection });
  latest.current = { item, selection };
  useDragSource(ref, {
    type: ASSET_DRAG,
    disabled: () => !exportable(latest.current.item),
    payload: () => {
      const now = latest.current;
      return (now.selection.keys.has(now.item.key) ? now.selection.targets : [now.item]).filter(exportable).map(assetOf);
    },
  });
};

export { useAssetDragOut };
