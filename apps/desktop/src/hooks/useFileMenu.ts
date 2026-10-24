/* @layer renderer-app @kind hook */
import { useRecentDocuments } from '@drizztdourden08/brock-react';
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { CONFIG_ENTRY_TEXT } from '../config-entry/config-entry.constants';
import { fileMenu } from '../files/file-menu';
import { openRecent } from '../files/open-recent';
import { recentMenuItem } from '../files/recent-menu-item';
import { useActiveAsset } from './useActiveAsset';

const useFileMenu = (): MenuEntry[] => {
  const { recent, clear, open } = useRecentDocuments();
  const kind = useActiveAsset()?.tab?.key.kind;
  const settings = kind === undefined ? CONFIG_ENTRY_TEXT.noAsset : CONFIG_ENTRY_TEXT.title(kind);
  return useMemo(
    () => fileMenu(recentMenuItem(recent, { open: (path) => void openRecent(open, path), clear: () => void clear() }), settings),
    [recent, clear, open, settings],
  );
};

export { useFileMenu };
