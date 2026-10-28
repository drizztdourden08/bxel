/* @layer renderer-app @kind hook */
import { useRecentDocuments } from '@drizztdourden08/brock-react';
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { fileMenu } from '../files/file-menu';
import { openRecent } from '../files/open-recent';
import { recentMenuItem } from '../files/recent-menu-item';
import { useBxelContext } from '../ui-context/useBxelContext';

const useFileMenu = (): MenuEntry[] => {
  const { recent, clear, open } = useRecentDocuments();
  const context = useBxelContext((current) => current);
  return useMemo(
    () => fileMenu(recentMenuItem(recent, { open: (path) => void openRecent(open, path), clear: () => void clear() }), context),
    [recent, clear, open, context],
  );
};

export { useFileMenu };
