/* @layer renderer-app @kind logic */
import type { SegmentOption } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ManagerView } from '../../../sheet-manager/manager.type';
import { SPRITE_HINTS } from '../SpritesPanel.constants';

const viewOptions = (): SegmentOption<ManagerView>[] => [
  {
    value: 'grid',
    icon: 'pixel-grid-view',
    title: MANAGER_TEXT.grid,
    hint: { label: MANAGER_TEXT.grid, description: SPRITE_HINTS.grid.description },
    tooltip: { description: SPRITE_HINTS.grid.description },
  },
  {
    value: 'list',
    icon: 'pixel-list-view',
    title: MANAGER_TEXT.list,
    hint: { label: MANAGER_TEXT.list, description: SPRITE_HINTS.list.description },
    tooltip: { description: SPRITE_HINTS.list.description },
  },
];

export { viewOptions };
