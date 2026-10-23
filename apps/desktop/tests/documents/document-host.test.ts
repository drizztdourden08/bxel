/* @layer renderer-app @kind test */
import { counterIdSource } from '@bxel/document';
import type { DocumentEvent, DocumentId, TransactionRequest, TransactionResult } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';

const projectOptions = (name: string) => ({
  name,
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
});

const openOne = (host: DocumentHost, name: string): DocumentId => {
  const created = host.create(projectOptions(name));
  if (!created.ok) throw new Error(created.error.message);
  return created.documentId;
};

const paint = (host: DocumentHost, documentId: DocumentId, overrides: Partial<TransactionRequest> = {}): TransactionResult => {
  const view = host.view(documentId);
  const sprite = view?.state.project.sprites[0];
  if (!view || !sprite) throw new Error('the document has no sprite');
  return host.execute({
    documentId,
    baseRevision: view.state.revision,
    mode: 'commit',
    origin: 'ui',
    label: 'Paint',
    steps: [
      {
        name: 'pixels.patch',
        targets: { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } },
        options: { rect: { x: 0, y: 0, width: 2, height: 1 }, pixels: new Uint8Array([1, 2]) },
      },
    ],
    previewPixels: 0,
    ...overrides,
  });
};

const revisionOf = (host: DocumentHost, documentId: DocumentId): number | undefined => host.view(documentId)?.state.revision;

const collect = (host: DocumentHost): DocumentEvent[] => {
  const events: DocumentEvent[] = [];
  host.subscribe((event) => events.push(event));
  return events;
};

const newHost = (): DocumentHost => createDocumentHost({ ids: counterIdSource() });

describe('DocumentHost lifecycle', () => {
  it('opens a project as a clean document at revision 1 and publishes open once', () => {
    const host = newHost();
    const events = collect(host);
    const documentId = openOne(host, 'first');
    const view = host.view(documentId);
    expect(view?.state.revision).toBe(1);
    expect(view?.clean).toBe(true);
    expect(view?.canUndo).toBe(false);
    expect(host.list()).toEqual([documentId]);
    expect(events.map((event) => event.kind)).toEqual(['open']);
  });

});

describe('DocumentHost transactions', () => {
  it('tracks revision and dirty state through commit, undo, redo and save', () => {
    const host = newHost();
    const documentId = openOne(host, 'first');
    expect(paint(host, documentId).ok).toBe(true);
    expect(host.view(documentId)).toMatchObject({ clean: false, canUndo: true, canRedo: false });
    expect(revisionOf(host, documentId)).toBe(2);
    expect(host.undo(documentId).ok).toBe(true);
    expect(host.view(documentId)).toMatchObject({ clean: true, canUndo: false, canRedo: true });
    expect(revisionOf(host, documentId)).toBe(3);
    expect(host.redo(documentId).ok).toBe(true);
    expect(host.view(documentId)).toMatchObject({ clean: false, canUndo: true, canRedo: false });
    expect(revisionOf(host, documentId)).toBe(4);
    expect(host.markSaved(documentId)).toBe(true);
    expect(host.view(documentId)?.clean).toBe(true);
    expect(host.undo(documentId).ok).toBe(true);
    expect(host.view(documentId)?.clean).toBe(false);
  });

});

describe('DocumentHost events', () => {
  it('publishes one event per change and none for a preview', () => {
    const host = newHost();
    const documentId = openOne(host, 'first');
    const events = collect(host);
    const watched: DocumentEvent[] = [];
    host.watch(documentId, (event) => watched.push(event));
    paint(host, documentId, { mode: 'preview', previewPixels: 8 });
    expect(events).toHaveLength(0);
    paint(host, documentId);
    host.undo(documentId);
    host.redo(documentId);
    host.markSaved(documentId);
    expect(events.map((event) => event.kind)).toEqual(['commit', 'undo', 'redo', 'save']);
    expect(watched).toEqual(events);
    expect(events.map((event) => event.revision)).toEqual([2, 3, 4, 4]);
  });

  it('shows the subscriber the updated view when an event arrives', () => {
    const host = newHost();
    const documentId = openOne(host, 'first');
    const seen: Array<number | undefined> = [];
    host.subscribe(() => seen.push(host.view(documentId)?.state.revision));
    paint(host, documentId);
    expect(seen).toEqual([2]);
  });

});

describe('DocumentHost rejections', () => {
  it('changes nothing for a stale transaction', () => {
    const host = newHost();
    const documentId = openOne(host, 'first');
    paint(host, documentId);
    const before = host.view(documentId);
    const events = collect(host);
    const result = paint(host, documentId, { baseRevision: 1 });
    expect(result.ok ? null : result.error.code).toBe('STALE_REVISION');
    expect(host.view(documentId)).toBe(before);
    expect(events).toHaveLength(0);
  });

});

describe('DocumentHost independence', () => {
  it('keeps two documents independent', () => {
    const host = newHost();
    const first = openOne(host, 'first');
    const second = openOne(host, 'second');
    expect(first).not.toBe(second);
    const events = collect(host);
    paint(host, first);
    expect(revisionOf(host, first)).toBe(2);
    expect(revisionOf(host, second)).toBe(1);
    expect(host.view(second)?.clean).toBe(true);
    expect(host.undo(second).ok).toBe(false);
    expect(events.map((event) => event.documentId)).toEqual([first]);
    expect(host.close(first)).toBe(true);
    expect(host.list()).toEqual([second]);
    expect(host.view(first)).toBeNull();
  });

});

describe('DocumentHost missing documents', () => {
  it('answers DOCUMENT_NOT_FOUND for a document that is not open', () => {
    const host = newHost();
    const documentId = openOne(host, 'first');
    host.close(documentId);
    const result = host.undo(documentId);
    expect(result.ok ? null : result.error.code).toBe('DOCUMENT_NOT_FOUND');
    expect(host.markSaved(documentId)).toBe(false);
  });

  it('reports a rejected project without opening a document', () => {
    const host = newHost();
    const created = host.create({ name: '' });
    expect(created.ok).toBe(false);
    expect(host.list()).toEqual([]);
  });
});
