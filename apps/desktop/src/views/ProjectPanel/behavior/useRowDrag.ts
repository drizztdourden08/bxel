/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { carriesAssets } from '../../../asset-drag/carries-assets';
import { readAssetDrag } from '../../../asset-drag/read-asset-drag';
import { writeAssetDrag } from '../../../asset-drag/write-asset-drag';
import { isExpandable } from '../../../panel-browser/is-expandable';
import { moveItems } from '../../../panel-browser/move-items';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import type { DragEvent } from 'react';
import type { DragActions, PanelParts } from '../ProjectPanel.type';
import { ROOT_DROP } from '../ProjectPanel.constants';
import { useDropSpring } from './useDropSpring';

const draggable = (item: BrowserItem): boolean => item.path !== '' && item.role !== 'ghost' && item.role !== 'group' && item.role !== 'linked';

const useRowDrag = ({ data, view, browser, selection }: PanelParts): DragActions => {
  const [dropKey, setDropKey] = useState<string | null>(null);
  const spring = useDropSpring(useCallback((key: string) => view.setOpen([key], true), [view]));
  const { tree } = data;

  const folderFor = useCallback((target: BrowserItem | null): BrowserItem | undefined => {
    if (target === null) return tree.mainKey === null ? undefined : tree.items.get(tree.mainKey);
    return isExpandable(target) && target.role !== 'group' && !target.readOnly ? target : undefined;
  }, [tree]);

  const dragProps = useCallback(
    (item: BrowserItem): Record<string, unknown> => {
      if (!draggable(item)) return {};
      return {
        draggable: true,
        onDragStart: (event: DragEvent<HTMLElement>) => {
          const inside = selection.keys.has(item.key);
          const items = (inside ? selection.targets : [item]).filter(draggable);
          if (!inside) selection.choose([item.key]);
          writeAssetDrag(event.dataTransfer, items.map((each) => ({ kind: each.kind, assetId: each.row?.assetId ?? null, path: each.path })));
        },
        onDragEnd: () => {
          setDropKey(null);
          spring.stop();
        },
      };
    },
    [selection, spring],
  );

  const dropProps = useCallback(
    (target: BrowserItem | null): Record<string, unknown> => {
      const folder = folderFor(target);
      if (folder === undefined) return {};
      const key = target?.key ?? ROOT_DROP;
      return {
        onDragOver: (event: DragEvent<HTMLElement>) => {
          if (!carriesAssets(event.dataTransfer)) return;
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer.dropEffect = 'move';
          setDropKey(key);
          if (target !== null && !view.expandedSet.has(target.key)) spring.start(target.key);
        },
        onDragLeave: () => setDropKey((now) => (now === key ? null : now)),
        onDrop: (event: DragEvent<HTMLElement>) => {
          event.preventDefault();
          event.stopPropagation();
          setDropKey(null);
          spring.stop();
          const items = readAssetDrag(event.dataTransfer).flatMap((asset) => browser.itemOf(asset.path) ?? []);
          void moveItems(items, folder);
        },
      };
    },
    [folderFor, view.expandedSet, spring, browser],
  );

  return { dropKey, dragProps, dropProps };
};

export { useRowDrag };
