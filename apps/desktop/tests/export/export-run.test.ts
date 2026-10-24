/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { decodeApng, decodeGif, decodePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { planExport } from '../../src/export/plan-export';
import { runExport } from '../../src/export/run-export';
import { addFrame, bytesOf, frozenOf, harness, memorySink, paint, settingsOf, step, stubJob } from './export-harness';

const FOLDER = 'C:\\art';

describe('revision freeze', () => {
  it('writes the revision that was captured when Export was pressed', () => {
    const h = harness();
    paint(h, 0, 0, 2);
    const frozen = frozenOf(h);
    const plan = planExport({ frozen, settings: settingsOf({}), selectedIds: [] });
    paint(h, 0, 1, 3);
    const decoded = decodePng(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array());
    expect(plan.revision).toBe(frozen.revision);
    expect(decoded.ok && Array.from(decoded.data.slice(0, 8))).toEqual([0x4b, 0x1f, 0xa0, 255, 0, 0, 0, 0]);
    const later = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [] });
    const newer = decodePng(later.files[0] ? bytesOf(later.files[0]) : new Uint8Array());
    expect(newer.ok && Array.from(newer.data.slice(4, 8))).toEqual([0x7b, 0x3f, 0xe4, 255]);
  });
});

describe('export run', () => {
  it('writes every file into the folder and counts them', async () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'sheet' }), selectedIds: [] });
    const memory = memorySink();
    const job = stubJob();
    const result = await runExport(job, memory.sink, { plan, folder: `${FOLDER}\\`, title: 'sprite' });
    expect(result).toEqual({ kind: 'done', count: 2 });
    expect(memory.written.map((entry) => entry.path)).toEqual([`${FOLDER}\\sprite.png`, `${FOLDER}\\sprite.json`]);
    expect(memory.written[1]?.text).toContain('"sprites"');
    expect(job.lines).toContain('Exporting sprite: 1 of 1 sprite');
  });

  it('writes nothing when the export is cancelled', async () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [] });
    const memory = memorySink();
    const controller = new AbortController();
    controller.abort();
    const result = await runExport(stubJob(controller.signal), memory.sink, { plan, folder: FOLDER, title: 'sprite' });
    expect(result).toEqual({ kind: 'cancelled' });
    expect(memory.written).toEqual([]);
  });

  it('reports a failed write with the count written before it', async () => {
    const h = harness();
    addFrame(h, 100);
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'frames', frames: 'all' }), selectedIds: [] });
    const memory = memorySink();
    memory.failAt = 1;
    const result = await runExport(stubJob(), memory.sink, { plan, folder: FOLDER, title: 'sprite' });
    expect(result).toEqual({ kind: 'failed', message: 'The disk is full', written: 1 });
  });
});

describe('animation export', () => {
  const animated = () => {
    const h = harness();
    addFrame(h, 25);
    addFrame(h, 100);
    paint(h, 0, 0, 2);
    paint(h, 1, 0, 3);
    paint(h, 2, 0, 4);
    return h;
  };

  it('writes a GIF with the frame times rounded to hundredths of a second', () => {
    const plan = planExport({ frozen: frozenOf(animated()), settings: settingsOf({ kind: 'animation', frames: 'all' }), selectedIds: [] });
    expect(plan.notes.at(-1)).toBe('GIF stores time in hundredths of a second. 1 of 3 frame times are rounded to the nearest 0.01 s.');
    const decoded = decodeGif(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array());
    expect(decoded.ok && decoded.frames.map((frame) => frame.delayMs)).toEqual([100, 30, 100]);
  });

  it('plays a ping-pong tag forward and back with its repeat count', () => {
    const h = animated();
    step(h, COMMAND_NAME.tagAdd, {
      name: 'loop',
      from: { by: 'index', index: 0 },
      to: { by: 'index', index: 2 },
      direction: 'pingpong',
      repeat: 3,
    });
    const plan = planExport({
      frozen: frozenOf(h),
      settings: settingsOf({ kind: 'animation', animation: 'apng', frames: 'tag', tag: 'loop' }),
      selectedIds: [],
    });
    expect(plan.files[0]?.name).toBe('sprite.png');
    expect(plan.notes).toContain('Tag loop plays 3 times.');
    const decoded = decodeApng(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array());
    expect(decoded.ok && decoded.frames).toHaveLength(4);
    expect(decoded.ok && decoded.loops).toBe(3);
  });
});
