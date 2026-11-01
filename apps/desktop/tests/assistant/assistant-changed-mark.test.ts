/* @layer renderer-app @kind test */
import { counterIdSource } from '@bxel/document';
import type { DocumentEvent, DocumentId, TransactionRequest } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { useAssistantChangedStore } from '../../src/stores/useAssistantChangedStore';
import { markAssistantChanges } from '../../src/workspace/mark-assistant-changes';

const OPTIONS = {
  name: 'marks',
  bank: {
    name: 'Bank',
    cap: 8,
    transparent: true,
    colors: [
      { rgb: '#140b26', name: 'Night' },
      { rgb: '#7b3fe4', name: 'Violet' },
    ],
  },
  sprite: { name: 'hero', width: 4, height: 4 },
};

type Painted = { readonly event: DocumentEvent; readonly spriteId: string; readonly host: DocumentHost; readonly documentId: DocumentId };

const paint = (origin: TransactionRequest['origin']): Painted => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const created = host.create(OPTIONS);
  if (!created.ok) throw new Error(created.error.message);
  const events: DocumentEvent[] = [];
  host.subscribe((event) => events.push(event));
  const view = host.view(created.documentId);
  const sprite = view?.state.artwork.sprites[0];
  if (!view || !sprite) throw new Error('the document has no sprite');
  const done = host.execute({
    documentId: created.documentId,
    baseRevision: view.state.revision,
    mode: 'commit',
    origin,
    label: 'Paint',
    steps: [{ name: 'pixels.patch', targets: { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } }, options: { rect: { x: 0, y: 0, width: 2, height: 1 }, pixels: new Uint8Array([1, 2]) } }],
    previewPixels: 0,
  });
  const event = events.find((each) => each.kind === 'commit');
  if (!done.ok || !event) throw new Error('the paint did not commit');
  return { event, spriteId: sprite.id, host, documentId: created.documentId };
};

const artworkOf = (painted: Painted) => {
  const view = painted.host.view(painted.documentId);
  if (!view) throw new Error('no view');
  return view.state.artwork;
};

describe('S2 the assistant changed mark', { tags: ['standard'] }, () => {
  beforeEach(() => useAssistantChangedStore.setState({ changed: {} }));

  it('marks the asset an assistant commit changed', () => {
    const painted = paint('mcp');
    markAssistantChanges(painted.event, artworkOf(painted));
    expect(useAssistantChangedStore.getState().changed[painted.spriteId]).toBe(true);
  });

  it('leaves the assets of the owner own edits unmarked', () => {
    const painted = paint('ui');
    markAssistantChanges(painted.event, artworkOf(painted));
    expect(useAssistantChangedStore.getState().changed).toEqual({});
  });

  it('clears the mark of one asset and keeps the others', () => {
    useAssistantChangedStore.getState().mark(['a', 'b']);
    useAssistantChangedStore.getState().clear('a');
    expect(useAssistantChangedStore.getState().changed).toEqual({ b: true });
  });
});
