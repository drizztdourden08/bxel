/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { ancestorsOf } from '../../../panel-browser/ancestors-of';
import { useRevealActiveStore } from '../../../stores/useRevealActiveStore';
import type { PanelParts } from '../ProjectPanel.type';
import { activeItemOf } from './active-item-of';

const useRevealActive = ({ data, view, selection }: PanelParts): void => {
  const pending = useRevealActiveStore((state) => state.pending);
  const { activeKey, tree } = data;
  const { fresh, expandedSet, setOpen } = view;

  useEffect(() => {
    if (!pending || fresh || tree.items.size === 0) return;
    if (!useRevealActiveStore.getState().take()) return;
    const item = activeItemOf(tree, activeKey);
    if (item === undefined) return;
    const closed = ancestorsOf(tree, item.key).filter((key) => !expandedSet.has(key));
    if (closed.length > 0) setOpen(closed, true);
    selection.choose([item.key]);
    selection.reveal(item.key, true);
  }, [pending, fresh, activeKey, tree, expandedSet, setOpen, selection]);
};

export { useRevealActive };
