/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { newKindEntries } from './new-kind-entries';

const newAssetEntry = (label: string, key?: string, hidden = false): ContextMenuEntry => ({ label, hidden, items: newKindEntries(key) });

export { newAssetEntry };
