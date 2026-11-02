/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import type { PanelPartProps } from '../../../ProjectPanel.type';
import type { TreeExpansion } from '../ProjectTree.type';

const useTreeExpansion = ({ browser, view }: PanelPartProps['model']): TreeExpansion => {
  const groups = useMemo(() => browser.nested.top.filter((item) => item.role === 'group').map((item) => item.key), [browser.nested]);
  const openGroups = useMemo(() => groups.filter((key) => !view.collapsedGroups.has(key)), [groups, view.collapsedGroups]);
  const expanded = useMemo(() => {
    if (browser.mode !== 'tree') return openGroups;
    const folders = browser.visible === null ? [...view.expandedSet, ...(browser.opened ?? [])] : [...browser.visible];
    return [...folders, ...openGroups];
  }, [browser.mode, browser.visible, browser.opened, view.expandedSet, openGroups]);
  const change = useCallback(
    (keys: readonly string[]) => {
      if (browser.mode === 'tree' && browser.visible === null) view.replaceOpen(keys.filter((key) => !groups.includes(key)));
      view.setCollapsed(groups.filter((key) => !keys.includes(key)));
    },
    [browser.mode, browser.visible, view, groups],
  );
  return { expanded, change };
};

export { useTreeExpansion };
