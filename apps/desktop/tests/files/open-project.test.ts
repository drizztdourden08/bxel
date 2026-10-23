/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { openFromDialog } from '../../src/files/open-from-dialog';
import { openProject } from '../../src/files/open-project';
import { performAction } from '../../src/files/perform-action';
import { saveProject } from '../../src/files/save-project';
import { createProject, harness, paintPixels, SAVED } from './file-harness';

describe('open project', () => {
  it('round trips a saved project into a new document', async () => {
    const { kit, host, memory, paths } = harness();
    const source = createProject(host);
    paintPixels(host, source);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, source, false);
    memory.picks.open = SAVED;
    paths.clear();
    const outcome = await openFromDialog(kit);
    expect(outcome).toEqual({ kind: 'done', path: SAVED, notice: null });
    const opened = host.list().find((id) => id !== source);
    const view = opened ? host.view(opened) : null;
    expect(view?.state.readOnly).toBe(false);
    expect(view?.clean).toBe(true);
    expect(view?.state.project).toEqual(host.view(source)?.state.project);
    expect(opened ? paths.get(opened) : undefined).toBe(SAVED);
  });

  it('focuses the document that already has the path', async () => {
    const { kit, host, memory, focused } = harness();
    const documentId = createProject(host);
    memory.picks.saveAs = SAVED;
    await saveProject(kit, documentId, false);
    await openProject(kit, SAVED);
    expect(host.list()).toEqual([documentId]);
    expect(focused).toEqual([documentId]);
  });

  it('returns cancelled when the open dialog is dismissed', async () => {
    const { kit, memory } = harness();
    memory.picks.open = null;
    expect(await openFromDialog(kit)).toEqual({ kind: 'cancelled' });
  });

  it('opens a path given by the system through the action runner', async () => {
    const { kit, host, memory } = harness();
    const documentId = createProject(host);
    memory.picks.saveAs = SAVED;
    await performAction(kit, { kind: 'save' }, documentId);
    const outcome = await performAction(kit, { kind: 'openPath', path: SAVED }, documentId);
    expect(outcome.kind).toBe('done');
  });

  it('asks for a project first when a save has no active document', async () => {
    const { kit } = harness();
    expect(await performAction(kit, { kind: 'save' }, null)).toEqual({
      kind: 'failed',
      message: 'Open or create a project first.',
    });
  });
});
