/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { isExpandable } from '../../../panel-browser/is-expandable';
import type { PanelParts } from '../ProjectPanel.type';

const useDefaultOpen = ({ data, view }: Pick<PanelParts, 'data' | 'view'>): void => {
  const { tree, ready } = data;
  const { fresh, replaceOpen } = view;

  useEffect(() => {
    if (!fresh || !ready || tree.mainKey === null) return;
    const top = [...(tree.children.get(tree.mainKey) ?? []), ...(tree.children.get(null) ?? [])];
    const open = top.flatMap((key) => {
      const item = tree.items.get(key);
      return item !== undefined && isExpandable(item) ? [key] : [];
    });
    if (open.length > 1) replaceOpen(open);
  }, [fresh, ready, tree, replaceOpen]);
};

export { useDefaultOpen };
