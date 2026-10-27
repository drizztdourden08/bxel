/* @layer tests @kind test */
import { checkGrant, decideTrust, modeOfGrant, normalizeTrustStore, PRESETS } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const old = (key: string, mode: string) => ({
  key,
  displayName: key,
  mode,
  firstApproved: '2026-10-01T00:00:00Z',
  lastConnected: '2026-10-02T00:00:00Z',
  lastVersion: '1.0',
});

const storeOf = (...programs: unknown[]) => normalizeTrustStore({ level: 'ask_once_remember', allowAllMode: 'read', programs });

const entryOf = (store: ReturnType<typeof storeOf>, key: string) => store.programs.find((program) => program.key === key);

describe('migrating the stored modes', () => {
  const store = storeOf(old('reader', 'read'), old('editor', 'edit'), old('shut-out', 'blocked'));

  it('turns mode read into Read only', () => {
    expect(entryOf(store, 'reader')).toMatchObject({ mode: 'read', grant: PRESETS.read_only.grant });
  });

  it('turns mode edit into Edit documents with App control and Layout at Edit, Settings at Read', () => {
    const grant = entryOf(store, 'editor')?.grant;
    expect(entryOf(store, 'editor')?.mode).toBe('edit');
    expect(grant?.bundles).toMatchObject({
      edit_pixels: 'edit',
      animation: 'edit',
      sheets_sprites: 'edit',
      tilemaps: 'edit',
      files_saving: 'edit',
      browse_files: 'edit',
      session: 'edit',
      read_documents: 'read',
      app_control: 'edit',
      layout: 'edit',
      settings: 'read',
    });
    expect(grant?.special.mayRestart).toBe(false);
    expect(grant?.tools).toEqual({});
  });

  it('turns mode blocked into blocked true and still denies the pairing', () => {
    expect(entryOf(store, 'shut-out')).toMatchObject({ mode: 'blocked', grant: { blocked: true } });
    expect(decideTrust({ name: 'shut-out', version: null }, store)).toEqual({ kind: 'deny' });
  });

  it('keeps an existing edit program able to edit, and a read program unable to', () => {
    const editor = entryOf(store, 'editor')?.grant;
    const reader = entryOf(store, 'reader')?.grant;
    if (!editor || !reader) throw new Error('missing entries');
    const batch = { documentId: 'doc_1', baseRevision: 1, steps: [{ name: 'pixels.patch' }, { name: 'map.paint' }, { name: 'animation.create' }, { name: 'sheet.create' }] };
    expect(checkGrant('apply_edits', batch, editor)).toBeNull();
    for (const tool of ['save_document', 'export_document', 'create_document', 'split_legacy_file', 'undo'] as const) expect(checkGrant(tool, {}, editor), tool).toBeNull();
    expect(checkGrant('close_document', { discard: true }, editor)).toBeNull();
    expect(checkGrant('stop_bxel', { unsaved: 'discard' }, editor)).toBeNull();
    expect(checkGrant('apply_edits', batch, reader)?.error.code).toBe('READ_LEVEL');
    expect(checkGrant('save_document', {}, reader)?.error.code).toBe('READ_LEVEL');
    expect(checkGrant('get_document', {}, reader)).toBeNull();
  });

  it('pairs a migrated edit program as an editing session', () => {
    expect(decideTrust({ name: 'editor', version: null }, store)).toMatchObject({ kind: 'pair', mode: 'edit', trust: 'remembered' });
    expect(decideTrust({ name: 'reader', version: null }, store)).toMatchObject({ kind: 'pair', mode: 'read' });
  });

  it('migrates the allow all mode the same way', () => {
    const allowAll = normalizeTrustStore({ level: 'allow_all', allowAllMode: 'edit', programs: [] });
    const decision = decideTrust({ name: 'anyone', version: null }, allowAll);
    expect(decision).toMatchObject({ kind: 'pair', mode: 'edit', trust: 'allow_all' });
    if (decision.kind === 'pair') expect(modeOfGrant(decision.grant)).toBe('edit');
  });
});

describe('reading a store written with a grant', () => {
  it('keeps a custom grant and derives the mode beside it', () => {
    const grant = { ...PRESETS.edit_documents.grant, bundles: { ...PRESETS.edit_documents.grant.bundles, tilemaps: 'read' }, tools: { save_document: 'disabled' } };
    const store = storeOf({ ...old('custom', 'edit'), grant });
    expect(entryOf(store, 'custom')?.grant).toEqual(grant);
    expect(entryOf(store, 'custom')?.mode).toBe('edit');
  });

  it('reads an entry that has only a grant', () => {
    const { mode: _unused, ...bare } = old('only-grant', 'edit');
    const store = storeOf({ ...bare, grant: PRESETS.full_control.grant });
    expect(entryOf(store, 'only-grant')).toMatchObject({ mode: 'edit', grant: PRESETS.full_control.grant });
  });

  it('lets an older Bxel that changed only the mode win over a stale grant', () => {
    const store = storeOf({ ...old('flipped', 'read'), grant: PRESETS.full_control.grant });
    expect(entryOf(store, 'flipped')).toMatchObject({ mode: 'read', grant: PRESETS.read_only.grant });
  });

  it('drops an entry with neither a mode nor a readable grant, and one with a bad mode', () => {
    const { mode: _unused, ...bare } = old('nothing', 'edit');
    const store = storeOf(bare, { ...bare, key: 'junk', grant: { v: 9 } }, old('root', 'root'));
    expect(store.programs).toEqual([]);
  });

  it('round trips: a normalized store normalizes to itself', () => {
    const once = storeOf(old('reader', 'read'), old('editor', 'edit'), old('shut-out', 'blocked'));
    expect(normalizeTrustStore(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });
});
