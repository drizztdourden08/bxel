/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget } from '../editor/active-target';
import type { EditorTarget } from '../editor/editor.type';
import { useActiveDocument } from './useActiveDocument';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  return useMemo(() => activeTarget(view), [view]);
};

export { useEditorTarget };
