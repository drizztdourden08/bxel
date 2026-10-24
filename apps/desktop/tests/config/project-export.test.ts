/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { projectExport } from '../../src/export/project-export';
import { manifestWithMeta } from '../../src/project-meta/manifest-with-meta';
import { withCover } from '../../src/project-meta/with-cover';
import { PROJECT_SOURCE } from '../../src/project-config/project-source.constants';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { liveArtwork, openedProject, savedManifest } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const manifest = () => {
  const found = useProjectStore.getState().project?.manifest;
  if (!found) throw new Error('no project');
  return found;
};

describe('the export page of the project hub', () => {
  it('starts unset: the scale reads 1, the template is empty and the file has no export block', async () => {
    const { held } = await openedProject();
    expect(PROJECT_SOURCE.get('project.export.scale')).toBe(1);
    expect(PROJECT_SOURCE.get('project.export.pathTemplate')).toBe('');
    expect(savedManifest(held).export).toBeUndefined();
    expect(projectExport()).toBeUndefined();
  });

  it('writes the scale and the template to the project file and the export window reads them', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.export.scale', 4);
    await PROJECT_SOURCE.set('project.export.pathTemplate', ' {sprite}-{frame} ');
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).export).toEqual({ scale: 4, pathTemplate: '{sprite}-{frame}' });
    expect(projectExport()).toEqual({ scale: 4, pathTemplate: '{sprite}-{frame}' });
    expect(PROJECT_SOURCE.get('project.export.scale')).toBe(4);
  });

  it('takes the block out of the file again when both go back to their start', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.export.scale', 2);
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).export).toEqual({ scale: 2 });
    await PROJECT_SOURCE.set('project.export.scale', 1);
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).export).toBeUndefined();
    expect(Object.keys(savedManifest(held))).not.toContain('export');
  });

  it('refuses a scale outside 1 to 8 and a template with a path separator', async () => {
    const { held } = await openedProject();
    await PROJECT_SOURCE.set('project.export.scale', 9);
    await PROJECT_SOURCE.set('project.export.pathTemplate', 'a/{sprite}');
    await PROJECT_SOURCE.flush();
    expect(savedManifest(held).export).toBeUndefined();
    expect(projectExport()).toBeUndefined();
  });

  it('survives a change of cover and of project meta, which rebuild the manifest', async () => {
    const { documentId } = await openedProject();
    await PROJECT_SOURCE.set('project.export.scale', 3);
    await PROJECT_SOURCE.flush();
    expect(withCover(manifest(), null).export).toEqual({ scale: 3 });
    const artwork = liveArtwork(documentId);
    const source = { artwork, paths: new Map<string, string>(), folders: useProjectStore.getState().project?.folders ?? [] };
    expect(manifestWithMeta(manifest(), source).export).toEqual({ scale: 3 });
  });
});
