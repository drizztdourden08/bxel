/* @layer renderer-app @kind test */
import { decodeAnimation } from '@bxel/document/native';
import { describe, expect, it, vi } from 'vitest';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { confirmAction } from '../project/project-mocks';
import { animatedSampleArtwork } from './animated-sample';
import { heldProject } from './held-project';
import { artworkOf, workspaceOf } from './open-sample-project';

vi.mock('../../src/documents/document-host.constants', async () => (await import('../legacy/legacy-app-commands')).legacyAppCommands());
vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const { held, open } = heldProject();

const opened = () => open(animatedSampleArtwork());

describe('opening a project with a sprite that has frames', () => {
  it('turns the sprite into an animation in memory and leaves the files as they were', async () => {
    const { documentId, paths, artwork } = await opened();
    const animated = artwork.sprites.find((sprite) => sprite.frames.length > 1);
    const loaded = artworkOf(documentId);
    expect(loaded.animations.map((animation) => [animation.name, animation.frames.length])).toEqual([[animated?.name, 3]]);
    expect(loaded.sprites.filter((sprite) => sprite.role === 'sprite').map((sprite) => sprite.name)).toEqual(['tree']);
    expect(loaded.sprites.filter((sprite) => sprite.role === 'frame')).toHaveLength(1);
    expect(new Set(loaded.animations[0]?.frames.map((frame) => frame.spriteId)).size).toBe(1);
    expect(held.rig.disk.writes).toEqual([]);
    expect([...held.rig.disk.files.keys()].some((path) => path.endsWith('.bxanim'))).toBe(false);
    expect(paths.get(animated?.id ?? '')).toBeDefined();
  });

  it('says what happened in the migration notice and marks the new animation and the old sprite', async () => {
    const { documentId, artwork } = await opened();
    const animated = artwork.sprites.find((sprite) => sprite.frames.length > 1);
    const workspace = workspaceOf(documentId);
    const animation = artworkOf(documentId).animations[0];
    expect(workspace.migration?.notice).toBe('1 sprite had frames. It became 1 animation. Save to write it.');
    expect(workspace.dirty.has(`animation:${animation?.id}`)).toBe(true);
    expect(workspace.dirty.has(`sprite:${animated?.id}`)).toBe(true);
    expect(workspace.paths.get(animation?.id ?? '')).toMatch(/\.bxanim$/);
  });

  it('keeps the tag and the frame times on the animation', async () => {
    const { documentId } = await opened();
    const animation = artworkOf(documentId).animations[0];
    expect(animation?.frames.map((frame) => frame.durationMs)).toEqual([100, 120, 140]);
    expect(animation?.tags).toMatchObject([{ kind: 'span', name: 'run', direction: 'pingpong' }]);
  });
});

describe('saving the migration', () => {
  it('writes the animation, moves the old sprite file to the trash after one question and clears the bar', async () => {
    const { documentId, paths, artwork } = await opened();
    const animated = artwork.sprites.find((sprite) => sprite.frames.length > 1);
    const animation = artworkOf(documentId).animations[0];
    const target = workspaceOf(documentId).paths.get(animation?.id ?? '') ?? '';
    const outcome = await saveWorkspace(held.rig.kit, documentId);
    expect(outcome.kind).toBe('done');
    expect(confirmAction).toHaveBeenCalledTimes(1);
    expect(confirmAction.mock.calls[0]?.[0]).toMatchObject({ title: 'Move the old sprite files to the trash?' });
    expect(held.rig.disk.trashed).toEqual([paths.get(animated?.id ?? '')]);
    expect(held.rig.disk.writes).toContain(target);
    const report = decodeAnimation(held.rig.disk.files.get(target) as Uint8Array);
    expect(report.slice?.artwork.animations?.[0]?.frames).toHaveLength(3);
    expect(workspaceOf(documentId).dirty.size).toBe(0);
  });
});
