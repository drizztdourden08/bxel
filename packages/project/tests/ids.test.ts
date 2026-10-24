/* @layer tests @kind test */
import { createFolderId, createProjectId, isFolderId, isProjectId } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index * 7 + 3);

describe('ids', () => {
  it('creates ids in the same style as the document ids', () => {
    const project = createProjectId(bytes);
    const folder = createFolderId(bytes);
    expect(project).toMatch(/^prj_[0-9a-hjkmnp-tv-z]{12}$/);
    expect(folder).toMatch(/^fld_[0-9a-hjkmnp-tv-z]{12}$/);
    expect(isProjectId(project)).toBe(true);
    expect(isFolderId(folder)).toBe(true);
  });

  it('is deterministic for the same bytes', () => {
    expect(createProjectId(bytes)).toBe(createProjectId(bytes));
  });

  it('checks the prefix and the alphabet', () => {
    expect(isProjectId('prj_8d2k4m6q9x1v')).toBe(true);
    expect(isFolderId('fld_7r2k9m4q')).toBe(true);
    expect(isProjectId('fld_7r2k9m4q')).toBe(false);
    expect(isFolderId('prj_8d2k4m6q9x1v')).toBe(false);
    expect(isProjectId('prj_ab')).toBe(false);
    expect(isProjectId('prj_8d2k4m6q9x1u')).toBe(false);
    expect(isProjectId(42)).toBe(false);
  });
});
