/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { dirtyDocuments } from '../../src/recovery/dirty-documents';
import { RECOVERY_TEXT } from '../../src/recovery/recovery.constants';
import { looseSeed } from '../../src/workspace/loose-seed';
import { workspaceOf } from '../../src/workspace/workspace-of';
import { createArtwork, harness, paintPixels } from '../files/file-harness';

describe('close prompt', () => {
  it('names the dirty assets of each document, by file name once saved', () => {
    const { host } = harness();
    const saved = createArtwork(host);
    const fresh = createArtwork(host);
    const clean = createArtwork(host);
    paintPixels(host, saved);
    paintPixels(host, fresh);
    const views = Object.fromEntries([saved, fresh, clean].flatMap((id) => {
      const view = host.view(id);
      return view ? [[id, view]] : [];
    }));
    const artwork = views[saved]?.state.artwork;
    const sprite = artwork?.sprites[0];
    if (!artwork || !sprite) throw new Error('no sprite');
    const workspace = workspaceOf(saved, { ...looseSeed(artwork, false), paths: new Map([[sprite.id, 'C:/art/hero.bxsprite']]), dirty: new Set([`sprite:${sprite.id}`]) });
    expect(dirtyDocuments(views, [saved, fresh, clean], { [saved]: workspace })).toEqual([
      { documentId: saved, name: 'hero.bxsprite' },
      { documentId: fresh, name: 'Untitled' },
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
    const id = createArtwork(host);
    const view = host.view(id);
    expect(dirtyDocuments(view ? { [id]: view } : {}, [id], {})).toEqual([]);
  });
});
