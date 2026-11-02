/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { PROJECT_MENU } from '../ProjectPanel.constants';

const fromSelectionEntries = (sprites: number): readonly ContextMenuEntry[] =>
  sprites === 0
    ? []
    : ['separator', { command: 'project.new_sheet_from', label: PROJECT_MENU.newSheetFrom }, { command: 'project.new_animation_from', label: PROJECT_MENU.newAnimationFrom }];

export { fromSelectionEntries };
