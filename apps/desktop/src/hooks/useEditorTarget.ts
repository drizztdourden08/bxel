/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget } from '../editor/active-target';
import type { EditorTarget } from '../editor/editor.type';
import { useToolStore } from '../stores/useToolStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  const layerId = useToolStore((state) => state.layerId);
  return useMemo(() => activeTarget(view, layerId), [view, layerId]);
};

export { useEditorTarget };
