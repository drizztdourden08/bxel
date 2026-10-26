/* @layer tests @kind test */
import type { DocumentFolder } from '@bxel/project';
import { isNativeAsset, isUnderRole, resolveRole } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const folder = (roles: DocumentFolder['roles']): DocumentFolder => ({ folderId: 'fld_7r2k9m4q', name: 'Game', path: '.', roles });

describe('the animations role', () => {
  it('falls back to the sprites folder until it is set', () => {
    expect(resolveRole({ sprites: 'art' }, 'animations')).toBe('art');
    expect(resolveRole({ sprites: 'art', animations: 'motion' }, 'animations')).toBe('motion');
    expect(resolveRole({ sheets: 'sheets' }, 'animations')).toBeUndefined();
    expect(resolveRole({ sprites: 'art' }, 'sheets')).toBeUndefined();
  });

  it('counts a file beside the sprites as under the animations role', () => {
    const roles = { sprites: 'art' };
    expect(isUnderRole(folder(roles), 'animations', 'art/walk.bxanim')).toBe(true);
    expect(isUnderRole(folder({ ...roles, animations: 'motion' }), 'animations', 'art/walk.bxanim')).toBe(false);
  });

  it('packs animation files as native assets', () => {
    expect(isNativeAsset('motion/Walk.BXANIM')).toBe(true);
  });
});
