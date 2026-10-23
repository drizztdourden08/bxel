/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { historyItem } from '../editor/history-item';
import { useActiveDocument } from './useActiveDocument';

const useUndoItem = (): TitleBarButtonSpec => historyItem('undo', useActiveDocument()?.canUndo ?? false);

export { useUndoItem };
