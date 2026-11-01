/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { buildTools } from '@bxel/mcp';
import { documentCommands } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { animationOf, frameAt, freshAnimation, live, paintFrame, run } from '../timeline/timeline-harness';
import { check } from './app-tools-check';
import { contextWith, reset } from './app-tools-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./app-tools-mock')).brockMock());

const { ok, code } = check;

const tools = buildTools(documentCommands);

type Play = { tagId: string | null; flip: string | null; mirrorOf: string | null; facing: string | null; forever: boolean; steps: { index: number; ms: number; flip: string | null }[]; passMs: number; totalMs: number; fps: number };

const documentId = (): string => live().documentId;

const withTags = (): { idle: string; mirror: string } => {
  const animation = animationOf().id;
  const frames = animationOf().frames;
  const first = frames[0]?.spriteId ?? '';
  const at = (index: number) => ({ by: 'index', index });
  run('Setup', [
    { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'four' } },
    ...frames.map((_unused, index) => ({ name: COMMAND_NAME.animationFrameUpdate, targets: null, options: { animation, frame: at(index), durationMs: 100 } })),
    { name: COMMAND_NAME.animationFrameUpdate, targets: null, options: { animation, frame: at(2), sprite: first } },
    { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'span', name: 'idle', from: at(0), to: at(1), repeat: 2, facing: 'e' } },
    { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'name', name: 'idle' }, flip: 'x', facing: 'w' } },
  ]);
  const [idle, mirror] = animationOf().tags;
  return { idle: idle?.id ?? '', mirror: mirror?.id ?? '' };
};

const render = async (target: Record<string, unknown>, extra: Record<string, unknown> = {}) => {
  const tool = tools.find((candidate) => candidate.name === 'render_preview');
  const input = tool?.input.parse({ documentId: documentId(), target: { animationId: animationOf().id, ...target }, scale: 2, ...extra });
  const done = await TOOL_HANDLERS.render_preview?.(input, contextWith());
  if (!done) throw new Error('no handler');
  return { outcome: done.outcome as Record<string, unknown>, images: done.images };
};

beforeEach(() => {
  reset();
  freshAnimation(4);
  paintFrame(0, 1, 1, 1);
  paintFrame(1, 5, 5, 1);
});

describe('S2 get_animation play order', { tags: ['standard'] }, () => {
  it('lists the play order of the whole animation and of each tag with totals and fps', async () => {
    const { idle, mirror } = withTags();
    const read = await ok('get_animation', { documentId: documentId(), animationId: animationOf().id });
    const plays = read.plays as Play[];
    expect(plays.map((play) => play.tagId)).toEqual([null, idle, mirror]);
    expect(plays[0]?.steps.map((step) => step.index)).toEqual([0, 1, 2, 3]);
    expect(plays[1]).toMatchObject({ forever: false, passMs: 200, totalMs: 400, fps: 10, facing: 'e', flip: null });
    expect(plays[1]?.steps.map((step) => [step.index, step.ms])).toEqual([[0, 100], [1, 100], [0, 100], [1, 100]]);
    expect(plays[2]).toMatchObject({ mirrorOf: idle, facing: 'w', flip: 'x', totalMs: 400 });
    expect(plays[2]?.steps.every((step) => step.flip === 'x')).toBe(true);
  });

  it('maps each facing to its tag and marks a frame that repeats an earlier sprite', async () => {
    const { idle, mirror } = withTags();
    const read = await ok('get_animation', { documentId: documentId(), animationId: animationOf().id });
    expect(read.facings).toEqual({ e: idle, w: mirror });
    expect((read.frames as { sameSpriteAs: number | null }[]).map((frame) => frame.sameSpriteAs)).toEqual([null, null, 0, null]);
  });
});

describe('S2 render_preview additions', { tags: ['standard'] }, () => {
  it('draws the tag of a facing, flipped for a mirror tag, as a strip of its frames', async () => {
    const { idle, mirror } = withTags();
    const east = await render({ facing: 'e' });
    const west = await render({ facing: 'w' });
    expect(east.outcome).toMatchObject({ ok: true, width: 8 * 2 * 2, height: 8 * 2 });
    expect(east.outcome.uri).toContain(`tag/${idle}`);
    expect(west.outcome.uri).toContain(`tag/${mirror}`);
    expect(east.outcome.indexHash).not.toBe(west.outcome.indexHash);
    expect(east.images).toHaveLength(1);
  });

  it('refuses a facing no tag plays', async () => {
    withTags();
    expect((await render({ facing: 'n' })).outcome.ok).toBe(false);
  });

  it('draws one row per facing in compass order', async () => {
    const { idle, mirror } = withTags();
    const grid = await render({ allFacings: true });
    expect(grid.outcome).toMatchObject({ ok: true, rows: [{ facing: 'e', tagId: idle }, { facing: 'w', tagId: mirror }], width: 8 * 2 * 2, height: 8 * 2 * 2 });
  });

  it('returns a gif and an apng with the frame times to judge the timing', async () => {
    withTags();
    const gif = await render({ facing: 'e' }, { animated: 'gif' });
    expect(gif.outcome).toMatchObject({ ok: true, mimeType: 'image/gif', frames: 2, totalMs: 200 });
    expect(Buffer.from(gif.images[0] ?? '', 'base64').subarray(0, 6).toString('latin1')).toBe('GIF89a');
    const apng = await render({ facing: 'w' }, { animated: 'apng' });
    expect(apng.outcome).toMatchObject({ ok: true, mimeType: 'image/apng', frames: 2, totalMs: 200 });
    expect([...Buffer.from(apng.images[0] ?? '', 'base64').subarray(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    const whole = await render({}, { animated: 'gif' });
    expect(whole.outcome).toMatchObject({ ok: true, frames: 4 });
  });

  it('refuses animated on one frame and with allFacings', async () => {
    withTags();
    expect((await render({ frameId: frameAt(0) }, { animated: 'gif' })).outcome.ok).toBe(false);
    expect((await render({ allFacings: true }, { animated: 'gif' })).outcome.ok).toBe(false);
  });

  it('draws a frame with its onion ghosts as the canvas does, and plain without onion', async () => {
    withTags();
    useTimelineStore.getState().setOnion({ on: false, before: 1, after: 1, wrap: true, opacity: 80 });
    const plain = await render({ frameId: frameAt(1) });
    const ghosted = await render({ frameId: frameAt(1) }, { onion: true });
    expect(ghosted.outcome).toMatchObject({ ok: true, width: 16, height: 16 });
    expect(plain.images).toHaveLength(1);
    expect(ghosted.images[0]).not.toBe(plain.images[0]);
    expect(await code('render_preview', { documentId: documentId(), target: { animationId: animationOf().id }, onion: true })).not.toBe('OK');
  });
});
