/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { followActiveDocument } from './follow-active-document';
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
  ];
  return () => {
    for (const stop of stops) stop();
  };
};

export { watchWorkspaces };
