/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { followActiveDocument } from './follow-active-document';
import { followMapPick } from './follow-map-pick';
import { followSpritePick } from './follow-sprite-pick';
import { onHostChange } from './on-host-change';
import { onWorkspaceEvent } from './on-workspace-event';

const watchWorkspaces = (): (() => void) => {
  const { host } = useDocumentStore.getState();
  const stops = [
    host.subscribe(onWorkspaceEvent),
    host.subscribeChanges(onHostChange),
    useDocumentStore.subscribe(followActiveDocument),
    useSpriteStore.subscribe(followSpritePick),
    useTilemapStore.subscribe(followMapPick),
  ];
  return () => {
    for (const stop of stops) stop();
  };
};

export { watchWorkspaces };
