/* @layer renderer-app @kind logic */
import { findTile } from '@bxel/document';
import { hasPreview } from '../editor/pending/has-preview';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useImageTabStore } from '../stores/useImageTabStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTileset } from '../tilemap/current-tileset';
import { currentTab } from '../workspace/current-tab';
import type { ContextInput } from './bxel-context.type';

const animatedTileOf = (): boolean => {
  const { editKey } = useTilemapStore.getState();
  const tileset = editKey === null ? null : currentTileset();
  return tileset !== null && editKey !== null && findTile(tileset, editKey)?.animation !== undefined;
};

const imageActive = (): boolean => {
  const { activeId, tabs } = useImageTabStore.getState();
  return activeId !== null && tabs.some((each) => each.id === activeId);
};

const tabKindOf = (open: boolean): ContextInput['tabKind'] => {
  const kind = open ? (currentTab()?.key.kind ?? null) : null;
  return kind === 'project' ? null : kind;
};

const selectionInput = (activeId: string | null): Pick<ContextInput, 'pixelSelection' | 'cellSelection' | 'spriteSelection' | 'frameSelection' | 'clipboard'> => {
  const selection = useSelectionStore.getState();
  return {
    pixelSelection: selection.mask !== null && selection.owner === activeId,
    cellSelection: useTilemapStore.getState().selection !== null,
    spriteSelection: useSpriteStore.getState().selected.length,
    frameSelection: useTimelineStore.getState().selection.frames.length,
    clipboard: selection.clipboard === null ? 'none' : 'pixels',
  };
};

const readContextInput = (): ContextInput => {
  const { activeId, views } = useDocumentStore.getState();
  const view = activeId === null ? undefined : views[activeId];
  return {
    ...selectionInput(activeId),
    tabKind: tabKindOf(view !== undefined),
    imageActive: imageActive(),
    isolated: useSpriteStore.getState().isolated,
    tileEdit: useTilemapStore.getState().editMode,
    pending: hasPreview(),
    tool: useToolStore.getState().tool,
    animatedTile: animatedTileOf(),
    readOnly: view?.state.readOnly ?? false,
    projectOpen: useProjectStore.getState().project !== null,
    canUndo: view?.canUndo ?? false,
    canRedo: view?.canRedo ?? false,
  };
};

export { readContextInput };
