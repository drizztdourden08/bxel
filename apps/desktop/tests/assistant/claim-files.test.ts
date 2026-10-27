/* @layer electron-main @kind test */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { claimFiles } from '../../electron/assistant/claim-files';

const stateOf = (folder: string, allow = vi.fn()) => ({ ctx: { documents: { allow } }, folder }) as never;

describe('claimFiles', () => {
  it('opens each file in the assistant folder for writing, once', () => {
    const folder = mkdtempSync(join(tmpdir(), 'bxel-claim-'));
    const allow = vi.fn();
    const claimed = claimFiles(stateOf(folder, allow), [join(folder, 'a.bxsprite'), join(folder, 'b.bxsprite')]);
    expect(claimed).toEqual([join(folder, 'a.bxsprite'), join(folder, 'b.bxsprite')]);
    expect(allow).toHaveBeenCalledTimes(2);
  });

  it('gives a file that exists a number instead of the same name', () => {
    const folder = mkdtempSync(join(tmpdir(), 'bxel-claim-'));
    writeFileSync(join(folder, 'a.bxsprite'), 'x');
    writeFileSync(join(folder, 'a 2.bxsprite'), 'x');
    expect(claimFiles(stateOf(folder), [join(folder, 'a.bxsprite')])).toEqual([join(folder, 'a 3.bxsprite')]);
  });

  it('leaves a file outside the assistant folder alone and closed', () => {
    const folder = mkdtempSync(join(tmpdir(), 'bxel-claim-'));
    const allow = vi.fn();
    const outside = join(tmpdir(), 'elsewhere.bxsprite');
    expect(claimFiles(stateOf(folder, allow), [outside, join(folder, '..', 'up.bxsprite')])).toEqual([outside, join(folder, '..', 'up.bxsprite')]);
    expect(allow).not.toHaveBeenCalled();
  });
});
