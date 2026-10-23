/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { dirtyNames } from '../../src/recovery/dirty-names';
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
    expect(dirtyNames(views, [saved, fresh, clean], (id) => paths.get(id))).toEqual(['hero.bxel', 'Untitled.bxel']);
  });

  it('asks to save before closing and says what Quit does', () => {
    const text = RECOVERY_TEXT.closePrompt('hero.bxel');
    expect(text.startsWith('Save changes to hero.bxel before closing?')).toBe(true);
    expect(text).toContain('Quit keeps a recovery copy.');
  });

  it('has nothing to say when every document is saved', () => {
    const { host } = harness();
    const id = createProject(host);
    const view = host.view(id);
    expect(dirtyNames(view ? { [id]: view } : {}, [id], () => undefined)).toEqual([]);
  });
});
