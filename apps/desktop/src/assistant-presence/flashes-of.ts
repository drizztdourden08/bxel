/* @layer renderer-app @kind logic */
import type { DocumentEvent } from '@bxel/document';
import type { PresenceFlash } from '../stores/assistant-presence-store.type';
import { FLASH_LIMIT } from './assistant-presence.constants';

const flashesOf = (event: DocumentEvent, id: number): PresenceFlash[] =>
  event.changes.sprites
    .filter((sprite) => sprite.kind !== 'removed')
    .flatMap((sprite) => sprite.cels.map((cel) => ({ id, documentId: event.documentId, spriteId: sprite.id, frameId: cel.frameId, rect: cel.rect })))
    .slice(0, FLASH_LIMIT);

export { flashesOf };
