/* @layer tests @kind test */
import {
  canSee,
  canSeeFolder,
  checkProjectAccess,
  checkWrite,
  DEFAULT_SCOPE_SETTINGS,
  effectiveAccess,
  filterVisible,
  hiddenFailure,
  normalizeScopeSettings,
} from '@bxel/mcp';
import type { SeeTarget } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const places: { name: string; target: SeeTarget }[] = [
  { name: 'open', target: 'open_document' },
  { name: 'recent', target: 'recent_file' },
  { name: 'project', target: 'project_file' },
];

describe('assistant can see', () => {
  it('defaults to everything', () => {
    expect(DEFAULT_SCOPE_SETTINGS).toEqual({ see: 'everything', write: 'where_bxel_can' });
  });

  it('filters a list of places by the three choices', () => {
    const names = (see: 'everything' | 'open_and_projects' | 'projects') =>
      filterVisible(places, see, (place) => place.target).map((place) => place.name);
    expect(names('everything')).toEqual(['open', 'recent', 'project']);
    expect(names('open_and_projects')).toEqual(['open', 'project']);
    expect(names('projects')).toEqual(['project']);
  });

  it('checks one target', () => {
    expect(canSee('projects', 'open_document')).toBe(false);
    expect(canSee('open_and_projects', 'recent_file')).toBe(false);
    expect(canSee('everything', 'recent_file')).toBe(true);
  });

  it('answers hidden things the same as missing ones', () => {
    expect(hiddenFailure('document').error.code).toBe('DOCUMENT_NOT_FOUND');
    expect(hiddenFailure('file').error.code).toBe('FILE_NOT_FOUND');
    expect(hiddenFailure('project').error.code).toBe('PROJECT_NOT_FOUND');
    expect(hiddenFailure('document').error.retry).toBe('after_read');
  });
});

describe('assistant can write', () => {
  it('allows every place at the default choice', () => {
    for (const target of ['own_file', 'project_file', 'assistant_folder'] as const) {
      expect(checkWrite('where_bxel_can', target)).toBeNull();
    }
  });

  it('refuses a document own file at projects and the assistant folder', () => {
    expect(checkWrite('projects_and_assistant_folder', 'own_file')?.error.code).toBe('WRITE_NOT_ALLOWED');
    expect(checkWrite('projects_and_assistant_folder', 'project_file')).toBeNull();
    expect(checkWrite('projects_and_assistant_folder', 'assistant_folder')).toBeNull();
  });

  it('refuses everything at nowhere', () => {
    for (const target of ['own_file', 'project_file', 'assistant_folder'] as const) {
      const failure = checkWrite('nowhere', target);
      expect(failure?.error.code).toBe('WRITE_NOT_ALLOWED');
      expect(failure?.error.retry).toBe('after_owner');
    }
  });

  it('falls back to the defaults for stored junk, field by field', () => {
    expect(normalizeScopeSettings(null)).toEqual(DEFAULT_SCOPE_SETTINGS);
    expect(normalizeScopeSettings({ see: 'projects', write: 'bogus' })).toEqual({ see: 'projects', write: 'where_bxel_can' });
  });
});

describe('project grants and modes', () => {
  it('takes the lower of the session mode and the project grant', () => {
    expect(effectiveAccess('edit', 'edit')).toBe('edit');
    expect(effectiveAccess('edit', 'read')).toBe('read');
    expect(effectiveAccess('read', 'edit')).toBe('read');
    expect(effectiveAccess('edit', 'off')).toBe('off');
  });

  it('refuses a missing grant and a write over a read grant', () => {
    expect(checkProjectAccess('off', 'read')?.error.code).toBe('PROJECT_NOT_GRANTED');
    expect(checkProjectAccess('read', 'edit')?.error.code).toBe('PROJECT_NOT_GRANTED');
    expect(checkProjectAccess('read', 'read')).toBeNull();
    expect(checkProjectAccess('edit', 'edit')).toBeNull();
  });
});

describe('the folders the owner shows the assistant', () => {
  it('shows every folder when the project names none', () => {
    expect(canSeeFolder(undefined, 'fld_a')).toBe(true);
  });

  it('shows only the named folders, and none for an empty list', () => {
    expect(canSeeFolder(['fld_a', 'fld_b'], 'fld_b')).toBe(true);
    expect(canSeeFolder(['fld_a'], 'fld_b')).toBe(false);
    expect(canSeeFolder([], 'fld_a')).toBe(false);
  });
});
