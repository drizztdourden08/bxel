/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { ancestorsOf } from '../../../project-browser/ancestors-of';
import type { PanelParts } from '../ProjectPanel.type';

const useFollowActive = ({ data, view, selection }: PanelParts): void => {
  const done = useRef<string | null>(null);
  const { activeKey, tree } = data;
  const { follow, expandedSet, setOpen } = view;

  useEffect(() => {
    if (!follow || activeKey === null || done.current === activeKey) return;
    const item = [...tree.items.values()].find((each) => each.row?.loaded === true && each.row.assetId !== null && `${each.row.kind}:${each.row.assetId}` === activeKey);
    if (item === undefined) return;
    done.current = activeKey;
    const closed = ancestorsOf(tree, item.key).filter((key) => !expandedSet.has(key));
    if (closed.length > 0) setOpen(closed, true);
    selection.reveal(item.key);
  }, [follow, activeKey, tree, expandedSet, setOpen, selection]);
};

export { useFollowActive };
