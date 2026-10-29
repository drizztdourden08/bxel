/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { moveItems } from '../../../panel-browser/move-items';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { ASSET_DRAG_TYPE } from '../../ProjectBrowser/ProjectBrowser.constants';
import type { DragActions, DropEvent, PanelParts } from '../ProjectPanel.type';
import { dropFolder } from './drop-folder';
import { exportable } from './exportable';

const pathsOf = (event: DropEvent): readonly string[] => {
  try {
    const parsed: unknown = JSON.parse(event.dataTransfer.getData(ASSET_DRAG_TYPE));
    return Array.isArray(parsed) ? parsed.flatMap((each: { path?: unknown }) => (typeof each.path === 'string' ? [each.path] : [])) : [];
  } catch {
    return [];
  }
};

const carries = (event: DropEvent): boolean => event.dataTransfer.types.includes(ASSET_DRAG_TYPE);

const useRowDrag = ({ data }: PanelParts): DragActions => {
  const [dropKey, setDropKey] = useState<string | null>(null);
  const { tree } = data;

  const canMoveInto = useCallback(
    (keys: readonly string[], folderKey: string | null): boolean => {
      const folder = dropFolder(folderKey === null ? undefined : tree.items.get(folderKey));
      if (folder === undefined) return false;
      return keys.some((key) => {
        const item = tree.items.get(key);
        return item !== undefined && exportable(item) && key !== folder.key && item.parentKey?.toLowerCase() !== folder.key.toLowerCase();
      });
    },
    [tree],
  );

  const moveKeys = useCallback(
    (keys: readonly string[], folderKey: string) => {
      const folder = dropFolder(tree.items.get(folderKey));
      if (folder !== undefined) void moveItems(keys.flatMap((key) => tree.items.get(key) ?? []), folder);
    },
    [tree],
  );

  const dropOn = useCallback(
    (target: BrowserItem | null): Record<string, unknown> => {
      const folder = dropFolder(target ?? (tree.mainKey === null ? undefined : tree.items.get(tree.mainKey)));
      if (folder === undefined) return {};
      return {
        onDragOver: (event: DropEvent) => {
          if (!carries(event)) return;
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer.dropEffect = 'move';
          setDropKey(folder.key);
        },
        onDragLeave: () => setDropKey((now) => (now === folder.key ? null : now)),
        onDrop: (event: DropEvent) => {
          if (!carries(event)) return;
          event.preventDefault();
          event.stopPropagation();
          setDropKey(null);
          void moveItems(pathsOf(event).flatMap((path) => tree.items.get(path) ?? []), folder);
        },
      };
    },
    [tree],
  );

  return { dropKey, dropOn, moveKeys, canMoveInto };
};

export { useRowDrag };
