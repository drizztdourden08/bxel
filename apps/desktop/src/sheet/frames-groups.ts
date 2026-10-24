/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { FrameScope } from '../stores/sprite-store.type';
import { radioItem } from './radio-item';
import { SHEET_TEXT } from './sheet.constants';

const framesGroups = (current: FrameScope, pick: (value: FrameScope) => void): MenuGroup[] => [
  {
    id: 'frames',
    items: [radioItem('current', SHEET_TEXT.currentFrameItem, current, pick), radioItem('all', SHEET_TEXT.allFramesItem, current, pick)],
  },
];

export { framesGroups };
