/* @layer renderer-app @kind logic */
import type { Sheet } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ARRANGE_KINDS } from './arrange-kind-entries.constants';

const arrangeKindEntries = (sheet: Sheet | null): readonly ContextMenuEntry[] =>
  ARRANGE_KINDS.map((each) => ({ command: each.command, label: each.label, kind: 'radio' as const, checked: sheet?.layout.kind === each.kind }));

export { arrangeKindEntries };
