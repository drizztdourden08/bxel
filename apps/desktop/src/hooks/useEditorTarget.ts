/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget } from '../editor/active-target';
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useToolStore } from '../stores/useToolStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  const layerId = useToolStore((state) => state.layerId);
  const spriteId = useSpriteStore((state) => state.activeId);
  return useMemo(() => activeTarget(view, layerId, spriteId), [view, layerId, spriteId]);
};

export { useEditorTarget };
