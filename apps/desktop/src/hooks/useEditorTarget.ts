/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget } from '../editor/active-target';
import { editSpriteId } from '../editor/edit-sprite-id';
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { useActiveDocument } from './useActiveDocument';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  const layerId = useToolStore((state) => state.layerId);
  const mode = useSpriteStore((state) => state.mode);
  const sprite = useSpriteStore((state) => state.activeId);
  const tileMode = useTilemapStore((state) => state.editMode);
  const tile = useTilemapStore((state) => state.editSpriteId);
  const frameId = useTimelineStore((state) => state.frameId);
  const spriteId = editSpriteId(mode, tileMode, tile, sprite);
  return useMemo(() => activeTarget(view, layerId, spriteId, frameId), [view, layerId, spriteId, frameId]);
};

export { useEditorTarget };
