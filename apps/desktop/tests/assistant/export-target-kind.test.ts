/* @layer electron-main @kind test */
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { resolveTarget } from '../../electron/assistant/resolve-target';

const folder = (): string => mkdtempSync(join(tmpdir(), 'bxel-assistant-'));

const resolved = (format: string, fileName: string) => {
  const allow = vi.fn();
  const ctx = { documents: { allow, allowFolder: vi.fn() }, log: vi.fn() } as never;
  const input = { documentId: 'doc_aaaaaaaaaaaa', format, source: { animationId: 'anm_aaaaaaaaaaaa' }, scale: 1, overwrite: false, fileName };
  return resolveTarget(ctx, folder(), { tool: 'export_document', input }).then((target) => ({ target, allow }));
};

describe('a save into the assistant folder', () => {
  it('opens the whole folder, so the files a sheet or a map links to can be written beside it', async () => {
    const allowFolder = vi.fn();
    const ctx = { documents: { allow: vi.fn(), allowFolder }, log: vi.fn() } as never;
    const dir = folder();
    const input = { documentId: 'doc_aaaaaaaaaaaa', target: { fileName: 'tt-sheet.bxsheet', overwrite: false, moveAsset: false } };
    const target = await resolveTarget(ctx, dir, { tool: 'save_document', input });
    expect(target).toMatchObject({ ok: true });
    expect(allowFolder).toHaveBeenCalledWith(dir);
  });
});

describe('the file name an export may take in the assistant folder', () => {
  it('ends in .gif for format gif', async () => {
    const { target, allow } = await resolved('gif', 'walk.gif');
    expect(target).toMatchObject({ ok: true });
    expect(allow).toHaveBeenCalledOnce();
    expect(await resolved('gif', 'walk.png').then((each) => each.target)).toMatchObject({ ok: false });
  });

  it('ends in .png for png and png-indexed', async () => {
    expect((await resolved('png', 'walk.png')).target).toMatchObject({ ok: true });
    expect((await resolved('png-indexed', 'walk.png')).target).toMatchObject({ ok: true });
    expect((await resolved('png', 'walk.gif')).target).toMatchObject({ ok: false });
  });
});
