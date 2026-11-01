/* @layer renderer-app @kind logic */
import type { DocumentEvent } from '@bxel/document';
import { useAssistantPresenceStore } from '../stores/useAssistantPresenceStore';
import { FLASH_MS, PRESENCE_MS } from './assistant-presence.constants';
import { flashesOf } from './flashes-of';
import { prefersReducedMotion } from './prefers-reduced-motion';
import { presenceTextOf } from './presence-text-of';

let counter = 0;

const announceEdit = (event: DocumentEvent): void => {
  if (event.origin !== 'mcp' || event.kind !== 'commit') return;
  const text = presenceTextOf(event.label);
  if (text === null) return;
  counter += 1;
  const id = counter;
  const flashes = prefersReducedMotion() ? [] : flashesOf(event, id);
  useAssistantPresenceStore.getState().show({ id, documentId: event.documentId, text }, flashes);
  setTimeout(() => useAssistantPresenceStore.getState().endLine(id), PRESENCE_MS);
  if (flashes.length > 0) setTimeout(() => useAssistantPresenceStore.getState().endFlashes(id), FLASH_MS);
};

export { announceEdit };
