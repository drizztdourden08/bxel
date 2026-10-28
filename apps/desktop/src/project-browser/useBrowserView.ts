/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import type { AppSettings } from '../settings.type';
import { DEFAULT_PROJECT_VIEW } from './project-browser.constants';
import type { BrowserView, ProjectViewSettings } from './project-browser.type';

const useBrowserView = (projectId: string | null): BrowserView => {
  const { settings, patch } = useSettings<AppSettings>();
  const stored: ProjectViewSettings = useMemo(() => ({ ...DEFAULT_PROJECT_VIEW, ...settings.projectView }), [settings.projectView]);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const id = projectId ?? '';
  const expanded = useMemo(() => new Set(stored.expanded[id] ?? []), [stored.expanded, id]);

  const set = useCallback((change: Partial<ProjectViewSettings>) => patch({ projectView: { ...stored, ...change } }), [patch, stored]);
  const setOpen = useCallback(
    (keys: readonly string[], open: boolean) => {
      const next = new Set(expanded);
      for (const key of keys) {
        if (open) next.add(key);
        else next.delete(key);
      }
      set({ expanded: { ...stored.expanded, [id]: [...next] } });
    },
    [expanded, id, set, stored.expanded],
  );
  const toggleGroup = useCallback(
    (key: string) =>
      setCollapsed((now) => {
        const next = new Set(now);
        if (!next.delete(key)) next.add(key);
        return next;
      }),
    [],
  );

  return { ...stored, expandedSet: expanded, collapsedGroups: collapsed, openOnClick: settings.projectOpenOnClick, set, setOpen, toggleGroup };
};

export { useBrowserView };
