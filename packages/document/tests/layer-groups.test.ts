/* @layer core @kind test */
import { exportedSprite, flattenFrame } from '@bxel/document';
import { decodeArtwork, encodeArtwork } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';
import { FIRST } from './first-frame';
import { MUSHROOM, apply, expectUndoRedo, layerEngine, layerNames, layerOf, layerStep, named, rejection, sprite } from './layer-engine';
import { patchStep } from './layer-patch-step';

const grouped = () => {
  const engine = layerEngine();
  apply(engine, layerStep('layer.group', { layers: [named('Body'), named('Shadow')], name: 'Cap' }));
  return engine;
};

const firstRow = (engine: ReturnType<typeof layerEngine>): number[] => Array.from(flattenFrame(sprite(engine), FIRST).slice(0, 4));

describe('K1 layer.group, layer.ungroup, reorder, delete and duplicate with groups', { tags: ['critical'] }, () => {
  it('puts the layers under a new group above them, as one undo step', () => {
    const engine = layerEngine();
    expectUndoRedo(engine, layerStep('layer.group', { layers: [named('Body'), named('Shadow')], name: 'Cap' }));
    const cap = layerOf(engine, 'Cap');
    expect(cap).toMatchObject({ kind: 'group', cels: {} });
    expect(layerNames(engine).slice(0, 3)).toEqual(['Shadow', 'Body', 'Cap']);
    expect(layerOf(engine, 'Body').parentId).toBe(cap.id);
    expect(layerOf(engine, 'Shadow').parentId).toBe(cap.id);
  });

  it('takes the group apart and keeps the children where they are', () => {
    const engine = grouped();
    expectUndoRedo(engine, layerStep('layer.ungroup', { layer: named('Cap') }));
    expect(layerNames(engine)).not.toContain('Cap');
    expect(layerOf(engine, 'Body').parentId).toBeUndefined();
    expect(layerNames(engine).slice(0, 2)).toEqual(['Shadow', 'Body']);
  });

  it('refuses to nest deeper than two levels', () => {
    const engine = grouped();
    apply(engine, layerStep('layer.group', { layers: [named('Cap')], name: 'Outer' }));
    expect(rejection(engine, layerStep('layer.group', { layers: [named('Outer')], name: 'Third' })).code).toBe('LAYER_DEPTH');
  });

  it('refuses layers that sit in different groups and an ungroup of a pixel layer', () => {
    const engine = grouped();
    expect(rejection(engine, layerStep('layer.group', { layers: [named('Body'), named('Paint')] })).code).toBe('INVALID_OPTION');
    expect(rejection(engine, layerStep('layer.ungroup', { layer: named('Paint') })).code).toBe('LAYER_KIND');
  });

});

describe('K1 hiding, painting, moving and deleting with groups', { tags: ['critical'] }, () => {
  it('hides the children with the group and restores each child as it was', () => {
    const engine = grouped();
    const shown = firstRow(engine);
    apply(engine, layerStep('layer.update', { layer: named('Cap'), visible: false }));
    expect(layerOf(engine, 'Body').visible).toBe(true);
    expect(firstRow(engine)).toEqual([3, 0, 0, 0]);
    apply(engine, layerStep('layer.update', { layer: named('Cap'), visible: true }));
    expect(firstRow(engine)).toEqual(shown);
  });

  it('refuses to paint a group, a child of a hidden group and a child of a locked group', () => {
    const engine = grouped();
    expect(rejection(engine, patchStep(layerOf(engine, 'Cap').id, [6])).code).toBe('LAYER_KIND');
    apply(engine, layerStep('layer.update', { layer: named('Cap'), lock: { pixels: true } }));
    expect(rejection(engine, patchStep(layerOf(engine, 'Body').id, [6])).code).toBe('LAYER_LOCKED');
    apply(engine, layerStep('layer.update', { layer: named('Cap'), lock: { pixels: false }, visible: false }));
    expect(rejection(engine, patchStep(layerOf(engine, 'Body').id, [6])).code).toBe('LAYER_HIDDEN');
  });

  it('moves a group with its children, and moves a layer into a group by parentId', () => {
    const engine = grouped();
    apply(engine, layerStep('layer.reorder', { layer: named('Cap'), to: 3 }));
    expect(layerNames(engine)).toEqual(['Frozen', 'Paint', 'Ghost', 'Shadow', 'Body', 'Cap', 'Outline']);
    const cap = layerOf(engine, 'Cap');
    apply(engine, layerStep('layer.reorder', { layer: named('Paint'), to: 4, parentId: cap.id }));
    expect(layerOf(engine, 'Paint').parentId).toBe(cap.id);
    apply(engine, layerStep('layer.reorder', { layer: named('Paint'), to: 0, parentId: null }));
    expect(layerOf(engine, 'Paint').parentId).toBeUndefined();
    expect(rejection(engine, layerStep('layer.reorder', { layer: named('Cap'), to: 0, parentId: layerOf(engine, 'Body').id })).code).toBe('INVALID_OPTION');
  });

  it('deletes a group with its children and duplicates it with copies of them', () => {
    const engine = grouped();
    apply(engine, layerStep('layer.duplicate', { layer: named('Cap') }));
    const copy = layerOf(engine, 'Cap copy');
    expect(layerOf(engine, 'Body copy').parentId).toBe(copy.id);
    expectUndoRedo(engine, layerStep('layer.delete', { layer: named('Cap copy') }));
    expect(layerNames(engine)).not.toContain('Body copy');
  });
});

describe('K1 clip, view opacity, export flag and position lock', { tags: ['critical'] }, () => {
  it('draws a clipped layer only where the layer below has pixels', () => {
    const engine = layerEngine();
    apply(engine, patchStep(layerOf(engine, 'Paint').id, [4, 4, 4, 4]));
    expect(firstRow(engine)).toEqual([4, 4, 4, 4]);
    expectUndoRedo(engine, layerStep('layer.update', { layer: named('Paint'), clip: true }));
    expect(firstRow(engine)).toEqual([4, 2, 2, 0]);
  });

  it('keeps clip, view opacity, export and lock kinds through save and reopen', () => {
    const engine = layerEngine();
    apply(engine, layerStep('layer.update', { layer: named('Paint'), clip: true, viewOpacity: 40, exported: false, lock: { position: true } }));
    const report = decodeArtwork(encodeArtwork(engine.state(), null, () => 0));
    const paint = report.artwork?.sprites.find((each) => each.id === MUSHROOM)?.layers.find((layer) => layer.name === 'Paint');
    expect(paint).toMatchObject({ clip: true, viewOpacity: 40, exported: false, lock: { pixels: false, transparency: false, position: true } });
    apply(engine, layerStep('layer.update', { layer: named('Paint'), clip: false, viewOpacity: 100, exported: true }));
    expect(Object.keys(layerOf(engine, 'Paint'))).not.toContain('viewOpacity');
    expect(Object.keys(layerOf(engine, 'Paint'))).not.toContain('exported');
  });

  it('leaves a layer out of export when exported is false, and a group takes its children with it', () => {
    const engine = grouped();
    apply(engine, layerStep('layer.update', { layer: named('Paint'), exported: false }));
    apply(engine, layerStep('layer.update', { layer: named('Cap'), exported: false }));
    expect(exportedSprite(sprite(engine)).layers.map((layer) => layer.name)).toEqual(['Frozen', 'Ghost', 'Outline']);
  });
});

describe('K1 reference layers', { tags: ['critical'] }, () => {
  it('adds a linked image that never draws into the pixels or the export, and relinks it', () => {
    const engine = layerEngine();
    const before = firstRow(engine);
    expectUndoRedo(engine, layerStep('layer.reference_add', { path: 'C:/art/sketch.png', above: named('Paint') }));
    const sketch = layerOf(engine, 'sketch');
    expect(sketch).toMatchObject({ kind: 'reference', viewOpacity: 50, reference: { path: 'C:/art/sketch.png', x: 0, y: 0 }, cels: {} });
    expect(firstRow(engine)).toEqual(before);
    expect(exportedSprite(sprite(engine)).layers.map((layer) => layer.name)).not.toContain('sketch');
    expect(rejection(engine, patchStep(sketch.id, [6])).code).toBe('LAYER_KIND');
    apply(engine, layerStep('layer.reference_relink', { layer: named('sketch'), path: 'D:/new.png', x: 2 }));
    expect(layerOf(engine, 'sketch').reference).toEqual({ path: 'D:/new.png', x: 2, y: 0 });
    expect(rejection(engine, layerStep('layer.reference_relink', { layer: named('Paint'), path: 'x.png' })).code).toBe('LAYER_KIND');
  });
});
