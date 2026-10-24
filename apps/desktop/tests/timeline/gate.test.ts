/* @layer renderer-app @kind test */
import { flattenFrame, frameToRgba } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { decodeGif, decodePng } from '@bxel/formats';
import { beforeEach, describe, expect, it } from 'vitest';
import { addLayer } from '../../src/editor/add-layer';
import { allowPress } from '../../src/editor/allow-press';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitSession } from '../../src/editor/commit-session';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { planExport } from '../../src/export/plan-export';
import { addTag } from '../../src/timeline/add-tag';
import { changeTag } from '../../src/timeline/change-tag';
import { clearCels } from '../../src/timeline/clear-cels';
import { linkCels } from '../../src/timeline/link-cels';
import { setDuration } from '../../src/timeline/set-duration';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { bytesOf, settingsOf } from '../export/export-harness';
import { plainOptions } from '../editor/editor-harness';
import { celAt, durations, frameAt, freshDocument, layerIds, live, noticeText, paintCel, pickCels, pickRange, revision, withFrames } from './timeline-harness';

beforeEach(freshDocument);

const stateOf = () => {
  const view = useDocumentStore.getState().host.view(live().documentId);
  if (!view) throw new Error('the document is missing');
  return view.state;
};

const animate = (): void => {
  withFrames(4);
  paintCel(0, 1, 2);
  paintCel(1, 2, 3);
  paintCel(2, 3, 4);
  pickRange(0, 0);
  setDuration(60);
  pickRange(1, 2);
  setDuration(200);
  addTag();
  const id = live().sprite.tags[0]?.id;
  if (!id) throw new Error('no tag');
  changeTag('Rename tag', id, { name: 'walk', direction: 'pingpong' });
  pickCels({ layer: 0, frame: 2 }, { layer: 0, frame: 3 });
  linkCels();
};

describe('A7 gate: hidden and locked layers', () => {
  it('does not render a hidden layer in the frame, the canvas image or the export', () => {
    withFrames(2);
    paintCel(0, 1, 2);
    const visibleAlpha = (): number[] => {
      const state = stateOf();
      const plan = planExport({
        frozen: { revision: state.revision, artwork: state.artwork },
        settings: settingsOf({ layers: 'visible', scale: 1 }),
        selectedIds: [],
      });
      const decoded = decodePng(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array());
      return decoded.ok ? Array.from(decoded.data).filter((_, at) => at % 4 === 3) : [];
    };
    const { sprite, bank } = live();
    expect(Array.from(flattenFrame(sprite, frameAt(0))).some((index) => index !== 0)).toBe(true);
    expect(visibleAlpha().some((alpha) => alpha !== 0)).toBe(true);
    updateLayerFlag(live().layerId, 'visible', false);
    const hidden = live();
    expect(Array.from(flattenFrame(hidden.sprite, frameAt(0))).every((index) => index === 0)).toBe(true);
    expect(Array.from(frameToRgba(hidden.sprite, bank, frameAt(0))).every((value) => value === 0)).toBe(true);
    expect(visibleAlpha().length).toBeGreaterThan(0);
    expect(visibleAlpha().every((alpha) => alpha === 0)).toBe(true);
  });

  it('keeps a locked layer from every edit the timeline offers and from drawing', () => {
    withFrames(3);
    paintCel(0, 1, 2);
    paintCel(1, 2, 3);
    updateLayerFlag(live().layerId, 'locked', true);
    const before = revision();
    pickCels({ layer: 0, frame: 0 }, { layer: 0, frame: 1 });
    expect(clearCels()).toBe(false);
    expect(linkCels()).toBe(false);
    expect(revision()).toBe(before);
    const plan = { kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false } as const;
    expect(allowPress(plan, live())).toBe(false);
    const stroke = commitSession(beginStroke({ target: live(), tool: 'pencil', index: 3, options: plainOptions, at: { x: 5, y: 0 } }));
    expect(stroke?.ok).toBe(false);
    expect(revision()).toBe(before);
    expect(noticeText()).toBeDefined();
  });
});

describe('A7 gate: tag and range operations touch only the stated frames', () => {
  it('clears a range and leaves the other frames, the tags and the durations as they were', () => {
    animate();
    const sprite = live().sprite;
    const outside = [0, 3].map((at) => Array.from(flattenFrame(sprite, frameAt(at))));
    const tags = sprite.tags;
    const timing = durations();
    pickCels({ layer: 0, frame: 1 }, { layer: 0, frame: 2 });
    expect(clearCels()).toBe(true);
    const after = live().sprite;
    expect([0, 3].map((at) => Array.from(flattenFrame(after, frameAt(at))))).toEqual(outside);
    expect(Array.from(flattenFrame(after, frameAt(1))).every((index) => index === 0)).toBe(true);
    expect(after.tags).toEqual(tags);
    expect(durations()).toEqual(timing);
  });

  it('sets durations on a range without moving frames or tags', () => {
    animate();
    const before = live().sprite;
    pickRange(2, 3);
    setDuration(80);
    const after = live().sprite;
    expect(after.frames.map((frame) => frame.id)).toEqual(before.frames.map((frame) => frame.id));
    expect(durations()).toEqual([60, 200, 80, 80]);
    expect(after.tags).toEqual(before.tags);
  });
});

describe('A7 gate: timing, tags and cels survive save, reopen and animation export', () => {
  it('writes and reads back the durations, the tag and the linked cel', () => {
    animate();
    const state = stateOf();
    const bytes = encodeArtwork(state, null, () => 1_700_000_000_000);
    const report = decodeArtwork(bytes);
    expect(report.outcome).toBe('ok');
    const reopened = report.artwork?.sprites[0];
    if (!reopened) throw new Error('nothing was read');
    expect(reopened.frames.map((frame) => frame.durationMs)).toEqual([60, 200, 200, 100]);
    expect(reopened.frames.map((frame) => frame.id)).toEqual(state.artwork.sprites[0]?.frames.map((frame) => frame.id));
    expect(reopened.tags).toEqual([expect.objectContaining({ name: 'walk', direction: 'pingpong', from: frameAt(1), to: frameAt(2) })]);
    expect(celAt(reopened, 0, 3)).toBe(celAt(reopened, 0, 2));
    expect(report.artwork).toEqual(state.artwork);
  });

  it('exports the frames of a tag with their durations in play order', () => {
    animate();
    const state = stateOf();
    const plan = planExport({
      frozen: { revision: state.revision, artwork: state.artwork },
      settings: settingsOf({ kind: 'animation', frames: 'tag', tag: 'walk', animation: 'gif' }),
      selectedIds: [],
    });
    expect(plan.problem).toBeNull();
    const file = plan.files[0];
    const decoded = decodeGif(file ? bytesOf(file) : new Uint8Array());
    if (!decoded.ok) throw new Error(decoded.message);
    expect(decoded.frames.map((frame) => frame.delayMs)).toEqual([200, 200]);
  });

  it('exports every frame with its own duration', () => {
    animate();
    const state = stateOf();
    const plan = planExport({
      frozen: { revision: state.revision, artwork: state.artwork },
      settings: settingsOf({ kind: 'animation', frames: 'all', animation: 'gif' }),
      selectedIds: [],
    });
    const file = plan.files[0];
    const decoded = decodeGif(file ? bytesOf(file) : new Uint8Array());
    if (!decoded.ok) throw new Error(decoded.message);
    expect(decoded.frames.map((frame) => frame.delayMs)).toEqual([60, 200, 200, 100]);
  });

  it('keeps layers apart on a second layer', () => {
    animate();
    addLayer();
    expect(layerIds()).toHaveLength(2);
    const state = stateOf();
    const report = decodeArtwork(encodeArtwork(state, null, () => 1));
    expect(report.artwork?.sprites[0]?.layers.map((layer) => layer.name)).toEqual(['Layer 1', 'Layer 2']);
  });
});
