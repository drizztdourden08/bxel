/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { activeTarget, animationTarget } from '../editor/active-target';
import { editSpriteId } from '../editor/edit-sprite-id';
import type { EditorTarget } from '../editor/editor.type';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useToolStore } from '../stores/useToolStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { useActiveDocument } from './useActiveDocument';
import { useAnimationFocus } from './useAnimationFocus';

const useEditorTarget = (): EditorTarget | null => {
  const view = useActiveDocument();
  const focus = useAnimationFocus();
  const onAnimation = useWorkspaceStore((state) => state.tabs.find((each) => each.id === state.activeTab)?.key.kind === 'animation');
  const layerId = useToolStore((state) => state.layerId);
  const mode = useSpriteStore((state) => state.mode);
  const sprite = useSpriteStore((state) => state.activeId);
  const tileMode = useTilemapStore((state) => state.editMode);
  const tile = useTilemapStore((state) => state.editSpriteId);
  const spriteId = editSpriteId(mode, tileMode, tile, sprite);
  return useMemo(() => {
    if (onAnimation) return view && focus ? animationTarget(view, focus, layerId) : null;
    return activeTarget(view, layerId, spriteId);
  }, [view, focus, onAnimation, layerId, spriteId]);
};

export { useEditorTarget };
