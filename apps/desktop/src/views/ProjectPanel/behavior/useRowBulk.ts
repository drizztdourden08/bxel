/* @layer renderer-app @kind hook */
import { openContextMenu } from '@drizztdourden08/brock-react';
import { useCallback } from 'react';
import { duplicateItems } from '../../../project-browser/duplicate-items';
import { trashItems } from '../../../project-browser/trash-items';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { SEARCH_SELECTOR } from '../ProjectPanel.constants';
import type { BulkActions, PanelParts } from '../ProjectPanel.type';

const useRowBulk = ({ selection, edit }: PanelParts): BulkActions => {
  const { targets } = selection;
  const trash = useCallback(() => void trashItems(targets.filter((item) => item.role !== 'group')), [targets]);
  const duplicate = useCallback(() => duplicateItems(targets), [targets]);
  const rename = useCallback(() => {
    const first = targets.find((item) => item.role !== 'group' && item.role !== 'ghost' && !item.readOnly);
    if (first) edit.startRename(first.key);
  }, [targets, edit]);
  const showMenu = useCallback((key: string, point: { readonly x: number; readonly y: number }) => {
    openContextMenu(COMMAND_ZONE.project, { key }, { point, trigger: 'pointer' });
  }, []);
  const focusSearch = useCallback(() => document.querySelector<HTMLInputElement>(SEARCH_SELECTOR)?.focus(), []);
  return { trash, duplicate, rename, showMenu, focusSearch };
};

export { useRowBulk };
