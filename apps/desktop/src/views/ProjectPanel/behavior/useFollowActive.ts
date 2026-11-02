/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { ancestorsOf } from '../../../panel-browser/ancestors-of';
import type { PanelParts } from '../ProjectPanel.type';
import { activeItemOf } from './active-item-of';

const useFollowActive = ({ data, view, selection }: PanelParts): void => {
  const done = useRef<string | null>(null);
  const { activeKey, tree } = data;
  const { follow, fresh, expandedSet, setOpen } = view;

  useEffect(() => {
    if (fresh || !follow || activeKey === null || done.current === activeKey) return;
    const item = activeItemOf(tree, activeKey);
    if (item === undefined) return;
    done.current = activeKey;
    const closed = ancestorsOf(tree, item.key).filter((key) => !expandedSet.has(key));
    if (closed.length > 0) setOpen(closed, true);
    selection.reveal(item.key);
  }, [follow, fresh, activeKey, tree, expandedSet, setOpen, selection]);
};

export { useFollowActive };
