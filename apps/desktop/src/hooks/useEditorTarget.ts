/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget } from '../editor/active-target';
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  const layerId = useToolStore((state) => state.layerId);
  const spriteId = useSpriteStore((state) => state.activeId);
  const frameId = useTimelineStore((state) => state.frameId);
  return useMemo(() => activeTarget(view, layerId, spriteId, frameId), [view, layerId, spriteId, frameId]);
};

export { useEditorTarget };
