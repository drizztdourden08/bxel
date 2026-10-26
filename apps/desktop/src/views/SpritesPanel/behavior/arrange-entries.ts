/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { alignEntries } from '../../../context-menu/align-entries';
import { arrangeKindEntries } from '../../../context-menu/arrange-kind-entries';
import type { CurrentManager } from '../../../sheet-manager/manager.type';

const arrangeEntries = (manager: Pick<CurrentManager, 'sheet' | 'ids'>): readonly ContextMenuEntry[] => [
  ...arrangeKindEntries(manager.sheet),
  'separator',
  ...alignEntries(manager),
];

export { arrangeEntries };
