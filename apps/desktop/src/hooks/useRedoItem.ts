/* @layer renderer-app @kind hook */
import type { TitleBarButtonSpec } from '@drizztdourden08/brock-react';
import { historyItem } from '../editor/history-item';
import { useActiveDocument } from './useActiveDocument';
import { useStepName } from './useStepName';

const useRedoItem = (): TitleBarButtonSpec => historyItem('redo', useActiveDocument()?.canRedo ?? false, useStepName('redo'));

export { useRedoItem };
