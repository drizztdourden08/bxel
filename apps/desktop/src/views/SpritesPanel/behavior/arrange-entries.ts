/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { alignEntries } from '../../../context-menu/align-entries';
import { unless } from '../../../context-menu/unless';
import { ALIGN_TEXT } from '../../../sheet-manager/align-text.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { arrangeKindEntries } from '../../../context-menu/arrange-kind-entries';
import type { CurrentManager } from '../../../sheet-manager/manager.type';

const arrangeEntries = (manager: Pick<CurrentManager, 'sheet' | 'ids'>): readonly ContextMenuEntry[] => [
  ...arrangeKindEntries(manager.sheet),
  'separator',
  ...alignEntries(manager),
  { command: 'sprite.distribute_rows', label: MANAGER_TEXT.distributeRows, ...unless(manager.sheet?.layout.kind === 'manual' && manager.ids.length > 1, ALIGN_TEXT.byHand) },
];

export { arrangeEntries };
