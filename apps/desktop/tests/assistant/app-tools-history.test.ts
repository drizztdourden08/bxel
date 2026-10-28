/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { actAs } from '../../src/documents/acting-as';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { check } from './app-tools-check';
import { openDocument, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

beforeEach(reset);

const programEdit = (documentId: string, label: string) => {
  const { host } = useDocumentStore.getState();
  const view = host.view(documentId as never);
  if (!view) throw new Error('no view');
  return actAs({ actor: 's1', label: (text) => `Assistant (Check): ${text}` }, () =>
    host.execute({ documentId: documentId as never, baseRevision: view.state.revision, mode: 'commit', origin: 'ui', actor: 'owner', label, steps: [{ name: 'sprite.create', targets: null, options: { name: label, width: 4, height: 4 } }] as never, previewPixels: 0 }),
  );
};

const revisionOf = (documentId: string): number => useDocumentStore.getState().host.view(documentId as never)?.state.revision ?? 0;

describe('undo with redo and get_history', () => {
  it('attributes a change made while acting as the program, lists it, undoes it and redoes it', async () => {
    const documentId = openDocument();
    expect((await programEdit(documentId, 'Draw')).ok).toBe(true);
    const listed = await ok('get_history', { documentId, limit: 50 });
    expect(listed).toMatchObject({ total: 1, cursor: 1, canUndo: true, canRedo: false });
    expect((listed.entries as Record<string, unknown>[])[0]).toMatchObject({ actor: 'Check', origin: 'mcp', applied: true, label: 'Assistant (Check): Draw' });
    const undone = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 1 });
    expect(undone).toMatchObject({ direction: 'undo', count: 1, undone: { origin: 'mcp' } });
    const mid = await ok('get_history', { documentId, limit: 50 });
    expect(mid).toMatchObject({ cursor: 0, canRedo: true, canUndo: false });
    expect((mid.entries as { applied: boolean }[])[0]?.applied).toBe(false);
    const redone = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'redo', steps: 1 });
    expect(redone).toMatchObject({ direction: 'redo', count: 1 });
    expect(await ok('get_history', { documentId, limit: 50 })).toMatchObject({ cursor: 1, canRedo: false });
    expect(await code('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'redo', steps: 1 })).toBe('NOTHING_TO_REDO');
  });

  it('undoes several steps of its own and stops at an entry that is not its own', async () => {
    const documentId = openDocument();
    const { host } = useDocumentStore.getState();
    host.execute({ documentId: documentId as never, baseRevision: revisionOf(documentId), mode: 'commit', origin: 'ui', actor: 'owner', label: 'Owner edit', steps: [{ name: 'sprite.create', targets: null, options: { name: 'mine', width: 4, height: 4 } }] as never, previewPixels: 0 });
    await programEdit(documentId, 'One');
    await programEdit(documentId, 'Two');
    const done = await ok('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 5 });
    expect(done).toMatchObject({ count: 2 });
    expect(await code('undo', { documentId, expectedRevision: revisionOf(documentId), direction: 'undo', steps: 1 })).toBe('UNDO_NOT_OWN');
    const history = await ok('get_history', { documentId, limit: 5 });
    expect((history.entries as { actor: string }[])[0]?.actor).toBe('owner');
  });
});
