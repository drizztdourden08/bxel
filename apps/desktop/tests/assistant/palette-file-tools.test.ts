/* @layer electron-main @kind test */
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { resolveTarget } from '../../electron/assistant/resolve-target';
import { paletteNameProblem } from '../../src/palette-export/palette-name-problem';

const resolved = async (format: string, fileName: string) => {
  const ctx = { documents: { allow: vi.fn(), allowFolder: vi.fn() }, log: vi.fn() } as never;
  const input = { documentId: 'doc_aaaaaaaaaaaa', format, scale: 1, overwrite: false, fileName };
  return resolveTarget(ctx, mkdtempSync(join(tmpdir(), 'bxel-palette-')), { tool: 'export_palette', input });
};

describe('K2 the file name of an exported palette', { tags: ['critical'] }, () => {
  it('ends in the format, so a file never holds another format than its extension says', () => {
    expect(paletteNameProblem('gpl', 'hero.gpl')).toBeNull();
    expect(paletteNameProblem('ase', 'hero.ASE')).toBeNull();
    expect(paletteNameProblem('png', 'strip.png')).toBeNull();
    expect(paletteNameProblem('gpl', 'hero.pal')).not.toBeNull();
    expect(paletteNameProblem('hex', 'hero')).not.toBeNull();
  });

  it('takes the palette extensions in the assistant folder and refuses another one', async () => {
    for (const format of ['gpl', 'pal', 'hex', 'txt', 'ase']) expect(await resolved(format, `hero.${format}`)).toMatchObject({ ok: true });
    expect(await resolved('png', 'strip.png')).toMatchObject({ ok: true });
    expect(await resolved('txt', 'hero.exe')).toMatchObject({ ok: false });
    expect(await resolved('gpl', 'hero.png')).toMatchObject({ ok: false });
  });
});
