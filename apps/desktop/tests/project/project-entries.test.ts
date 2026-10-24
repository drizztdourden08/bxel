/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { newProjectFolder } from '../../src/project/new-project-folder';
import { renameEntry } from '../../src/project/rename-entry';
import { trashEntry } from '../../src/project/trash-entry';
import { watchFolder } from '../../src/project/watch-folder';
import { useFileStore } from '../../src/stores/useFileStore';
import { emit } from './disk-ops';
import { rig, ROOT } from './project-harness';
import type { Rig } from './project-harness';
import { confirmAction, toast } from './project-mocks';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: Rig;

const file = (name: string) => ({ dir: ROOT, name, kind: 'file' as const });

const folder = (name: string) => ({ dir: ROOT, name, kind: 'folder' as const });

beforeEach(() => {
  held = rig();
  held.disk.granted.add(ROOT.toLowerCase());
  held.disk.dirs.add(ROOT);
  held.disk.files.set(`${ROOT}/hero.bxel`, new Uint8Array(4));
});

describe('moving an entry to the trash', () => {
  it('asks first, then sends the file to the trash and forgets the path of an open document', async () => {
    useFileStore.getState().remember('doc_a' as never, `${ROOT}/hero.bxel`);
    expect(await trashEntry(file('hero.bxel'))).toEqual({ ok: true });
    expect(confirmAction).toHaveBeenCalledWith(expect.objectContaining({ variant: 'danger', confirmLabel: 'Move to trash' }));
    expect(held.disk.trashed).toEqual([`${ROOT}/hero.bxel`]);
    expect(held.disk.files.has(`${ROOT}/hero.bxel`)).toBe(false);
    expect(useFileStore.getState().paths).toEqual({});
    expect(toast).toHaveBeenCalledWith('Moved hero.bxel to the trash.', { variant: 'success' });
  });

  it('does nothing when the owner says no', async () => {
    confirmAction.mockImplementation(() => Promise.resolve(false));
    expect(await trashEntry(file('hero.bxel'))).toBeNull();
    expect(held.disk.trashed).toEqual([]);
    expect(held.disk.files.has(`${ROOT}/hero.bxel`)).toBe(true);
  });

  it('says in the question that a folder takes its content along', async () => {
    held.disk.dirs.add(`${ROOT}/old`);
    await trashEntry(folder('old'));
    expect(JSON.stringify(confirmAction.mock.calls[0]?.[0])).toContain('everything in it');
    expect(held.disk.trashed).toEqual([`${ROOT}/old`]);
  });

  it('reports a trash that Brock refuses', async () => {
    const outcome = await trashEntry(file('missing.bxel'));
    expect(outcome).toMatchObject({ ok: false });
  });
});

describe('renaming an entry', () => {
  it('renames a file and moves the path of an open document with it', async () => {
    useFileStore.getState().remember('doc_a' as never, `${ROOT}/hero.bxel`);
    expect(await renameEntry(file('hero.bxel'), 'knight.bxel')).toEqual({ ok: true });
    expect(held.disk.renamed).toEqual([`${ROOT}/hero.bxel -> ${ROOT}/knight.bxel`]);
    expect(useFileStore.getState().paths['doc_a']).toBe(`${ROOT}/knight.bxel`);
  });

  it('renames a folder and moves the documents inside it', async () => {
    held.disk.dirs.add(`${ROOT}/sub`);
    held.disk.files.set(`${ROOT}/sub/a.bxel`, new Uint8Array(1));
    useFileStore.getState().remember('doc_a' as never, `${ROOT}/sub/a.bxel`);
    expect(await renameEntry(folder('sub'), 'sprites')).toEqual({ ok: true });
    expect(useFileStore.getState().paths['doc_a']).toBe(`${ROOT}/sprites/a.bxel`);
  });

  it('keeps the ending of a file so it stays the same kind', async () => {
    const outcome = await renameEntry(file('hero.bxel'), 'hero.png');
    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? '' : outcome.message).toContain('.bxel');
    expect(held.disk.renamed).toEqual([]);
  });

  it('refuses a name that is taken, whatever the case', async () => {
    held.disk.files.set(`${ROOT}/Knight.bxel`, new Uint8Array(1));
    expect(await renameEntry(file('hero.bxel'), 'knight.bxel')).toMatchObject({ ok: false });
    expect(held.disk.renamed).toEqual([]);
  });

  it('allows a change of case alone', async () => {
    expect(await renameEntry(file('hero.bxel'), 'Hero.bxel')).toEqual({ ok: true });
    expect(held.disk.renamed).toHaveLength(1);
  });

  it.each(['a/b.bxel', 'a\\b.bxel', 'CON.bxel', '.hidden.bxel', ''])('refuses the name "%s"', async (name) => {
    expect((await renameEntry(file('hero.bxel'), name)).ok).toBe(false);
    expect(held.disk.renamed).toEqual([]);
  });

  it('does nothing when the name did not change', async () => {
    expect(await renameEntry(file('hero.bxel'), ' hero.bxel ')).toEqual({ ok: true });
    expect(held.disk.renamed).toEqual([]);
  });
});

describe('a new folder in the project', () => {
  it('is made with mkdir inside the folder', async () => {
    expect(await newProjectFolder(ROOT, 'sprites')).toEqual({ ok: true });
    expect(held.disk.made).toEqual([`${ROOT}/sprites`]);
    expect(toast).toHaveBeenCalledWith('Created the folder sprites.', { variant: 'success' });
  });

  it('refuses a name that is taken and a name that breaks the rules', async () => {
    held.disk.dirs.add(`${ROOT}/sprites`);
    expect((await newProjectFolder(ROOT, 'Sprites')).ok).toBe(false);
    expect((await newProjectFolder(ROOT, 'a/b')).ok).toBe(false);
    expect((await newProjectFolder(ROOT, 'NUL')).ok).toBe(false);
    expect(held.disk.made).toEqual([]);
  });
});

describe('watching a folder', () => {
  const settle = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
  };

  it('calls back on a change in that folder and stops after the stop function', async () => {
    const seen = vi.fn();
    const stop = watchFolder(held.disk.port, ROOT, seen);
    await settle();
    emit(held.disk, `${ROOT}/new.bxel`, 'add');
    emit(held.disk, `${ROOT}/sub/other.bxel`, 'add');
    expect(seen).toHaveBeenCalledTimes(1);
    stop();
    emit(held.disk, `${ROOT}/again.bxel`, 'add');
    expect(seen).toHaveBeenCalledTimes(1);
  });

  it('drops a watch that was stopped before it was set up', async () => {
    const seen = vi.fn();
    watchFolder(held.disk.port, ROOT, seen)();
    await settle();
    emit(held.disk, `${ROOT}/new.bxel`, 'add');
    expect(seen).not.toHaveBeenCalled();
  });

  it('stays quiet when the watch is refused', async () => {
    vi.spyOn(held.disk.port, 'watch').mockRejectedValueOnce(new Error('not granted'));
    expect(() => watchFolder(held.disk.port, ROOT, vi.fn())()).not.toThrow();
    await settle();
  });
});
