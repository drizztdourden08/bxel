/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { spriteCheck } from '../../src/new-sprite/sprite-check';
import { setStrict } from '../../src/platform-preset/set-strict';
import { artworkOf, blank, chosen, platformFile } from './platform-harness';

describe('S2 the size check of a sprite added to a file', { tags: ['standard'] }, () => {
  it('finds nothing for a size the platform of the file allows', () => {
    const check = spriteCheck(artworkOf(platformFile(chosen('snes-sprite'))), { width: 16, height: 16 });
    expect(check.report?.name).toBe('SNES sprite 4bpp');
    expect(check.report?.findings).toEqual([]);
    expect(check.blocked).toBeNull();
  });

  it('shows the finding for a size it does not allow, and does not block', () => {
    const check = spriteCheck(artworkOf(platformFile(chosen('snes-sprite'))), { width: 10, height: 10 });
    expect(check.report?.findings.map((finding) => finding.tier)).toEqual(['enforce']);
    expect(check.report?.findings[0]?.text).toContain('10x10 is not an allowed size for SNES sprite 4bpp');
    expect(check.blocked).toBeNull();
  });

  it('blocks that size when the file enforces its platform rules', () => {
    const file = platformFile(chosen('snes-sprite'));
    setStrict(file.host, file.documentId, true);
    const check = spriteCheck(artworkOf(file), { width: 10, height: 10 });
    expect(check.blocked).toContain('10x10 is not an allowed size for SNES sprite 4bpp');
    expect(check.blocked).toContain('Enforce platform rules is on');
    expect(spriteCheck(artworkOf(file), { width: 32, height: 32 }).blocked).toBeNull();
  });

  it('has no report for a file without a platform', () => {
    const check = spriteCheck(artworkOf(platformFile({ ...blank(), name: 'hero' })), { width: 10, height: 10 });
    expect(check).toEqual({ report: null, blocked: null });
    expect(spriteCheck(undefined, { width: 8, height: 8 })).toEqual({ report: null, blocked: null });
  });
});
