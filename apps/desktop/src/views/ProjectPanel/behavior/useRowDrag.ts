/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { moveItems } from '../../../panel-browser/move-items';
import type { DragActions, PanelParts } from '../ProjectPanel.type';
import { dropFolder } from './drop-folder';
import { exportable } from './exportable';

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

  const markDrop = useCallback((key: string, over: boolean) => {
    if (over) setDropKey(key);
    else setDropKey((now) => (now === key ? null : now));
  }, []);

  return { dropKey, markDrop, moveKeys, canMoveInto };
};

export { useRowDrag };
