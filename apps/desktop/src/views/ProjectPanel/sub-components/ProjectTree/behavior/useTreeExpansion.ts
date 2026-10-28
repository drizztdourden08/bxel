/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { PanelPartProps } from '../../../ProjectPanel.type';
import type { TreeExpansion } from '../ProjectTree.type';

const useTreeExpansion = ({ browser, view }: PanelPartProps['model']): TreeExpansion => {
  const groups = useMemo(() => browser.nested.top.filter((item) => item.role === 'group').map((item) => item.key), [browser.nested]);
  const expanded = useMemo(
    () => (browser.mode === 'tree' ? [...view.expandedSet] : groups.filter((key) => !view.collapsedGroups.has(key))),
    [browser.mode, view.expandedSet, view.collapsedGroups, groups],
  );
  const change = useCallback(
    (keys: readonly string[]) => {
      if (browser.mode === 'tree') view.replaceOpen(keys);
      else view.setCollapsed(groups.filter((key) => !keys.includes(key)));
    },
    [browser.mode, view, groups],
  );
  return { expanded, change };
};

export { useTreeExpansion };
