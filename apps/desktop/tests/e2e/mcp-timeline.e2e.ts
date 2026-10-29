/* @layer renderer-app @kind test */
import { PRESETS, programKey } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { MCP_CLIENT_NAME } from './support/mcp.constants';
import type { McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { useRig } from './support/use-rig';

type Held = { documentId: string; animationId: string; frames: string[]; revision: number };

const held: Partial<Held> = {};

const need = <Key extends keyof Held>(key: Key): Held[Key] => {
  const value = held[key];
  if (value === undefined) throw new Error(`no ${key} yet`);
  return value;
};

type TimelineView = {
  animationId: string | null;
  frameId: string | null;
  pickedFrameIds: string[];
  range: { kind: string };
  onion: { on: boolean; before: number; after: number; wrap: boolean };
};

const pushGrant = ({ session }: McpRig, grant: Grant): Promise<unknown> =>
  session.page.evaluate(`window.api.assistantSyncGrants(${JSON.stringify([{ key: programKey(MCP_CLIENT_NAME), grant }])})`);

const timelineOf = async ({ link }: McpRig): Promise<TimelineView> => (await callMcp(link.client, 'get_view')).data.timeline as TimelineView;

const setsUp = async ({ link }: McpRig): Promise<void> => {
  const created = await callMcp(link.client, 'create_document', {
    name: 'Walk',
    kind: 'animation',
    bank: { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#E0245E' }, { rgb: '#4B1FA0' }] },
    animation: { width: 8, height: 8, frames: 5 },
  });
  expect(created.ok, JSON.stringify(created.data)).toBe(true);
  held.documentId = String(created.data.documentId);
  const document = await callMcp(link.client, 'get_document', { documentId: need('documentId') });
  const animation = (document.data.animations as { animationId: string }[])[0];
  held.animationId = animation?.animationId;
  const read = await callMcp(link.client, 'get_animation', { documentId: need('documentId'), animationId: need('animationId') });
  held.frames = (read.data.frames as { frameId: string }[]).map((frame) => frame.frameId);
  held.revision = Number(read.data.revision);
  const view = await callMcp(link.client, 'get_view');
  const tab = (view.data.tabs as { tabId: string; documentId: string }[]).find((each) => each.documentId === need('documentId'));
  const focused = await callMcp(link.client, 'set_view', { focus: { tabId: tab?.tabId } });
  expect(focused.ok).toBe(true);
};

const readsTheTimeline = async (rig: McpRig): Promise<void> => {
  const timeline = await timelineOf(rig);
  expect(timeline).toMatchObject({ animationId: need('animationId'), frameId: need('frames')[0], range: { kind: 'whole' } });
  expect(timeline.pickedFrameIds).toEqual([need('frames')[0]]);
  expect(timeline.onion.on).toBe(false);
};

const setsTheOnionAndMovesThePlayhead = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const done = await callMcp(link.client, 'set_view', { timeline: { onion: { on: true, before: 2, after: 2, wrap: true } } });
  expect(done.data).toMatchObject({ ok: true, applied: ['timeline'] });
  expect((await timelineOf(rig)).onion).toMatchObject({ on: true, before: 2, after: 2, wrap: true });
  const moved = await callMcp(link.client, 'set_view', { timeline: { frameId: need('frames')[3] } });
  expect(moved.ok).toBe(true);
  expect(await timelineOf(rig)).toMatchObject({ frameId: need('frames')[3], pickedFrameIds: [need('frames')[0]] });
  const refused = await callMcp(link.client, 'set_view', { timeline: { frameId: 'afr_4k9m2q7x1v8c' } });
  expect(refused.code).toBe('VIEW_INVALID');
  const after = await callMcp(link.client, 'get_animation', { documentId: need('documentId'), animationId: need('animationId') });
  expect(after.data.revision).toBe(need('revision'));
};

const readsTheTimingAndRendersAFacing = async ({ link }: McpRig): Promise<void> => {
  const read = await callMcp(link.client, 'get_animation', { documentId: need('documentId'), animationId: need('animationId') });
  const plays = read.data.plays as { tagId: string | null; totalMs: number; steps: unknown[] }[];
  expect(plays[0]).toMatchObject({ tagId: null });
  expect(plays[0]?.steps).toHaveLength(5);
  expect(read.data.facings).toEqual({});
  const gif = await callMcp(link.client, 'render_preview', { documentId: need('documentId'), target: { animationId: need('animationId') }, animated: 'gif', scale: 2 });
  expect(gif.data).toMatchObject({ ok: true, mimeType: 'image/gif', frames: 5 });
  const ghosts = await callMcp(link.client, 'render_preview', { documentId: need('documentId'), target: { animationId: need('animationId'), frameId: need('frames')[2] }, onion: true, scale: 2 });
  expect(ghosts.data).toMatchObject({ ok: true, width: 16, height: 16 });
};

const refusesEditsAtReadButShowsStillWork = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  await pushGrant(rig, PRESETS.read_only.grant);
  await expect.poll(async () => (await link.client.listTools()).tools.some((tool) => tool.name === 'set_view'), { timeout: 15_000 }).toBe(true);
  const edit = {
    documentId: need('documentId'),
    baseRevision: need('revision'),
    label: 'Read level',
    steps: [{ name: 'animation.frame.add', targets: null, options: { animation: need('animationId'), source: { kind: 'empty', count: 1 } } }],
  };
  expect((await callMcp(link.client, 'apply_edits', edit)).code).toBe('READ_LEVEL');
  const moved = await callMcp(link.client, 'set_view', { timeline: { frameId: need('frames')[1], onion: { on: true, before: 1, after: 1 } } });
  expect(moved.data).toMatchObject({ ok: true, applied: ['timeline'] });
  expect((await callMcp(link.client, 'set_view', { tool: { id: 'fill' } })).code).toBe('READ_LEVEL');
  expect(await timelineOf(rig)).toMatchObject({ frameId: need('frames')[1], onion: { before: 1, after: 1 } });
  const after = await callMcp(link.client, 'get_animation', { documentId: need('documentId'), animationId: need('animationId') });
  expect((after.data.frames as unknown[]).length).toBe(5);
  expect(after.data.revision).toBe(need('revision'));
};

describe('the assistant reads and sets the timeline view', () => {
  const rig = useRig(openMcpRig);
  test('creates an animation and focuses its tab', () => setsUp(rig()));
  test('reads the playhead, the pick and the range', () => readsTheTimeline(rig()));
  test('sets the onion to two and two with wrap and moves the playhead', () => setsTheOnionAndMovesThePlayhead(rig()));
  test('reads the play order and renders a gif and an onion frame', () => readsTheTimingAndRendersAFacing(rig()));
  test('is refused edits at Read level, while show effects still apply', () => refusesEditsAtReadButShowsStillWork(rig()));
});
