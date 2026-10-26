/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { openTideProjectRig } from './support/open-tide-project-rig';
import type { ProjectRig } from './support/project-rig.type';
import { projectOnDisk } from './support/project-on-disk';
import { readSaved } from './support/read-saved';
import { setProjectAccessInUi } from './support/set-project-access-in-ui';
import { TIDE } from './support/tide.constants';
import { useRig } from './support/use-rig';

type Asset = { readonly kind: string; readonly name: string; readonly id: string; readonly usedBy: readonly string[]; readonly location: { readonly path: string } };

const SCALE = 2;

const assetsOf = async (rig: ProjectRig, kinds: readonly string[]): Promise<readonly Asset[]> => {
  const manifest = await projectOnDisk(rig.projectDir, TIDE.project);
  const listed = await callMcp(rig.link.client, 'list_assets', { projectId: manifest.projectId, kinds });
  return listed.data.assets as readonly Asset[];
};

const water = async (rig: ProjectRig): Promise<Asset> => {
  const found = (await assetsOf(rig, ['animation'])).find((asset) => asset.name === TIDE.animation);
  if (!found) throw new Error('the assistant does not list the animation');
  return found;
};

const documentOf = async (rig: ProjectRig): Promise<string> => {
  const animation = await water(rig);
  const opened = await callMcp(rig.link.client, 'open_file', { file: animation.location });
  expect(opened.data).toMatchObject({ ok: true, asset: { kind: 'animation', id: animation.id } });
  return String(opened.data.documentId);
};

const lists = async (rig: ProjectRig): Promise<void> => {
  const assets = await assetsOf(rig, ['animation', 'tileset', 'sprite']);
  const animation = assets.find((asset) => asset.kind === 'animation');
  const tileset = assets.find((asset) => asset.kind === 'tileset');
  expect(animation?.name).toBe(TIDE.animation);
  expect(animation?.location.path.endsWith('.bxanim')).toBe(true);
  expect(animation?.usedBy).toEqual([tileset?.id]);
  expect(assets.filter((asset) => asset.kind === 'sprite').map((asset) => asset.name)).toEqual(['hero']);
};

const reads = async (rig: ProjectRig): Promise<void> => {
  const documentId = await documentOf(rig);
  const animation = await water(rig);
  const read = await callMcp(rig.link.client, 'get_animation', { documentId, animationId: animation.id });
  expect(read.data).toMatchObject({ ok: true, name: TIDE.animation, width: TIDE.side, cycleMs: TIDE.frameMs * 2 });
  expect((read.data.frames as { owned: boolean }[]).map((frame) => frame.owned)).toEqual([true, true]);
  const strip = await callMcp(rig.link.client, 'render_preview', { documentId, target: { animationId: animation.id }, scale: SCALE });
  expect(strip.data).toMatchObject({ ok: true, width: TIDE.side * 2 * SCALE, height: TIDE.side * SCALE });
  const document = await callMcp(rig.link.client, 'get_document', { documentId });
  expect(document.data.animations).toMatchObject([{ name: TIDE.animation, frames: 2 }]);
};

const editsAndSaves = async (rig: ProjectRig): Promise<void> => {
  const documentId = await documentOf(rig);
  const animation = await water(rig);
  const before = await callMcp(rig.link.client, 'get_animation', { documentId, animationId: animation.id });
  const edit = {
    documentId,
    baseRevision: Number(before.data.revision),
    label: 'Add a frame',
    steps: [{ name: 'animation.frame.add', targets: null, options: { animation: animation.id, source: { kind: 'empty', count: 1 }, durationMs: 120 } }],
  };
  expect((await callMcp(rig.link.client, 'apply_edits', edit)).data).toMatchObject({ ok: true });
  const after = await callMcp(rig.link.client, 'get_animation', { documentId, animationId: animation.id });
  expect((after.data.frames as unknown[]).length).toBe(3);
  const saved = await callMcp(rig.link.client, 'save_document', { documentId, asset: { kind: 'animation', id: animation.id }, target: 'current' });
  expect(saved.data).toMatchObject({ ok: true, asset: { kind: 'animation', id: animation.id } });
  const onDisk = readSaved(join(rig.projectDir, animation.location.path));
  expect(onDisk.animations.find((each) => each.name === TIDE.animation)?.frames.map((frame) => frame.durationMs)).toEqual([TIDE.frameMs, TIDE.frameMs, 120]);
};

const refusedWhenReadOnly = async (rig: ProjectRig): Promise<void> => {
  const documentId = await documentOf(rig);
  const animation = await water(rig);
  await setProjectAccessInUi(rig.session, TIDE.project, 'Read only');
  const read = await callMcp(rig.link.client, 'get_animation', { documentId, animationId: animation.id });
  expect(read.data).toMatchObject({ ok: true });
  const edit = {
    documentId,
    baseRevision: Number(read.data.revision),
    label: 'Add a frame',
    steps: [{ name: 'animation.frame.add', targets: null, options: { animation: animation.id, source: { kind: 'empty', count: 1 } } }],
  };
  expect((await callMcp(rig.link.client, 'apply_edits', edit)).code).toBe('PROJECT_NOT_GRANTED');
  expect((await callMcp(rig.link.client, 'save_document', { documentId, asset: { kind: 'animation', id: animation.id }, target: 'current' })).code).toBe('PROJECT_NOT_GRANTED');
  const gif = await callMcp(rig.link.client, 'export_document', { documentId, format: 'gif', source: { animationId: animation.id }, scale: 1, location: { ...animation.location, path: 'exports/water.gif' } });
  expect(gif.ok).toBe(false);
  const again = await callMcp(rig.link.client, 'get_animation', { documentId, animationId: animation.id });
  expect((again.data.frames as unknown[]).length).toBe(3);
};

describe('the assistant and animations in a project', () => {
  const rig = useRig(openTideProjectRig);
  test('lists the animation with the tileset that plays it', () => lists(rig()));
  test('opens it, reads its frames and draws a strip', () => reads(rig()));
  test('adds a frame in a project granted editing and saves the file', () => editsAndSaves(rig()));
  test('is refused edits, saves and exports when the project is read only', () => refusedWhenReadOnly(rig()));
});
