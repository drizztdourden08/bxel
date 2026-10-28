/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useImageTabStore } from '../stores/useImageTabStore';
import { useProjectStore } from '../stores/useProjectStore';
import { usePendingStore } from '../stores/usePendingStore';
import { useSelectionStore } from '../stores/useSelectionStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import type { BxelContext } from './bxel-context.type';
import { currentContext } from './current-context';
import { sameContext } from './same-context';

const useContextStore = create<{ context: BxelContext }>()(() => ({ context: currentContext() }));

const refresh = (): void => {
  const next = currentContext();
  if (!sameContext(useContextStore.getState().context, next)) useContextStore.setState({ context: next });
};

[
  useDocumentStore,
  useImageTabStore,
  useProjectStore,
  usePendingStore,
  useSelectionStore,
  useSpriteStore,
  useTilemapStore,
  useTimelineStore,
  useToolStore,
  useWorkspaceStore,
].forEach((store) => store.subscribe(refresh));

export { useContextStore };
