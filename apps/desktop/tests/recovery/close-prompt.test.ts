/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { dirtyDocuments } from '../../src/recovery/dirty-documents';
import { RECOVERY_TEXT } from '../../src/recovery/recovery.constants';
import { createProject, harness, paintPixels } from '../files/file-harness';

describe('close prompt', () => {
  it('names the documents with unsaved changes, by file name once saved', () => {
    const { host, paths } = harness();
    const saved = createProject(host);
    const fresh = createProject(host);
    const clean = createProject(host);
    paths.set(saved, 'C:\\art\\hero.bxel');
    paintPixels(host, saved);
    paintPixels(host, fresh);
    const views = Object.fromEntries([saved, fresh, clean].flatMap((id) => {
      const view = host.view(id);
      return view ? [[id, view]] : [];
    }));
    expect(dirtyDocuments(views, [saved, fresh, clean], (id) => paths.get(id))).toEqual([
      { documentId: saved, name: 'hero.bxel' },
      { documentId: fresh, name: 'Untitled.bxel' },
    ]);
  });

  it('asks to save one file before closing, with Save, Discard and Cancel', () => {
    expect(RECOVERY_TEXT.closePrompt('hero.bxel')).toBe('Save changes to hero.bxel before closing?');
    expect([RECOVERY_TEXT.closeSave, RECOVERY_TEXT.closeDiscard, RECOVERY_TEXT.closeCancel]).toEqual([
      'Save',
      'Discard',
      'Cancel',
    ]);
  });

  it('has nothing to say when every document is saved', () => {
    const { host } = harness();
    const id = createProject(host);
    const view = host.view(id);
    expect(dirtyDocuments(view ? { [id]: view } : {}, [id], () => undefined)).toEqual([]);
  });
});
