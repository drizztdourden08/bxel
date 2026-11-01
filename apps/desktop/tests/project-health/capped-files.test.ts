/* @layer renderer-app @kind test */
import { createFolderId, createProjectDocument, createProjectId } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { buildHealth } from '../../src/project-health/build-health';
import type { IndexedFile, LinkIndex } from '../../src/workspace/link-index.type';
import { MAX_WORKSPACE_ASSETS } from '../../src/workspace/workspace.constants';
import type { OpenProject } from '../../src/project/project.type';

const idBytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 1);

const seed = createProjectDocument({ projectId: createProjectId(idBytes), folderId: createFolderId(idBytes), name: 'P' });

const project: OpenProject = {
  manifest: { ...seed, folders: [], organise: { tags: {}, collections: [], smart: [], pinned: [] } },
  rootRealPath: '/p',
  projectFile: '/p/p.bxproject',
  preview: null,
  folders: [],
};

const filesOf = (count: number): IndexedFile[] =>
  Array.from({ length: count }, (_unused, at) => ({ path: `/p/sprites/s${at}.bxsprite`, assetId: `id${at}`, kind: 'sprite', name: `s${at}` }));

const indexOf = (count: number): LinkIndex => ({ files: filesOf(count), links: [], duplicates: [] });

describe('S3 the health check for a project larger than the opening limit', { tags: ['standard'] }, () => {
  it('lists nothing while every file opens with the project', () => {
    expect(buildHealth(indexOf(MAX_WORKSPACE_ASSETS), { project, unsaved: 0 }).capped).toEqual([]);
  });

  it('lists the files after the limit and counts them as one thing to look at', () => {
    const report = buildHealth(indexOf(MAX_WORKSPACE_ASSETS + 3), { project, unsaved: 0 });
    expect(report.capped.map((file) => file.name)).toEqual([`s${MAX_WORKSPACE_ASSETS}`, `s${MAX_WORKSPACE_ASSETS + 1}`, `s${MAX_WORKSPACE_ASSETS + 2}`]);
    expect(report.total).toBe(report.unused.length + 1);
  });
});
