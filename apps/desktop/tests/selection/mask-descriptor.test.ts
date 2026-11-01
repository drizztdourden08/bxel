/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { MASK_DESCRIPTOR_SCHEMA } from '@bxel/mcp';
import type { MaskView } from '@bxel/raster';
import { saveSelection } from '../../src/editor/selection/save-selection';
import { pointMask } from '../../src/editor/selection/point-mask';
import { resolveMaskDescriptor } from '../../src/assistant/tools/resolve-mask-descriptor';
import { toCommandSteps } from '../../src/assistant/tools/to-command-steps';
import { BLOCK, countOn, openRig } from './selection-harness';

const MARKS = [{ x: 2, y: 2, width: 3, height: 1 }, { x: 10, y: 10, width: 1, height: 1 }] as const;

describe('S2 mask descriptors over MCP', { tags: ['standard'] }, () => {
  it('resolves a wand exactly as the owner wand does', () => {
    const rig = openRig();
    for (const box of MARKS) rig.paint(box, 5);
    const artwork = rig.host.view(rig.documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    const targets = { sprites: [rig.target().sprite.id] };
    const described = resolveMaskDescriptor({ by: 'wand', x: 3, y: 2, connectivity: 4 }, artwork, targets);
    expect(described.ok).toBe(true);
    const owner = pointMask(rig.target(), 'wand', { x: 3, y: 2 });
    expect(described.ok ? [...described.value.bits] : []).toEqual([...owner.bits]);
    expect(countOn(owner)).toBe(3);
  });

  it('resolves by colour, rect, runs and saved names', () => {
    const rig = openRig();
    for (const box of MARKS) rig.paint(box, 5);
    rig.select(BLOCK);
    expect(saveSelection('block')).toBe(true);
    const artwork = rig.host.view(rig.documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    const targets = { sprites: [rig.target().sprite.id] };
    const count = (descriptor: Parameters<typeof resolveMaskDescriptor>[0]): number => {
      const found = resolveMaskDescriptor(descriptor, artwork, targets);
      return found.ok ? countOn(found.value) : -1;
    };
    expect(count({ by: 'colour', index: 5 })).toBe(4);
    expect(count({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 3 } })).toBe(6);
    expect(count({ by: 'runs', runs: [[0, 0, 4]] })).toBe(5);
    expect(count({ by: 'opaque' })).toBe(4);
    expect(count({ by: 'saved', name: 'block' })).toBe(BLOCK.width * BLOCK.height);
    expect(count({ by: 'saved', name: 'missing' })).toBe(-1);
  });
});

describe('S2 mask descriptors in steps', { tags: ['standard'] }, () => {
  it('combines a list of described shapes', () => {
    const rig = openRig();
    const artwork = rig.host.view(rig.documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    const targets = { sprites: [rig.target().sprite.id] };
    const big = { by: 'rect' as const, rect: { x: 0, y: 0, width: 4, height: 4 } };
    const small = { by: 'rect' as const, rect: { x: 2, y: 2, width: 4, height: 4 } };
    const count = (op: 'add' | 'subtract' | 'intersect'): number => {
      const found = resolveMaskDescriptor({ by: 'combine', op, of: [big, small] }, artwork, targets);
      return found.ok ? countOn(found.value) : -1;
    };
    expect(count('add')).toBe(16 + 16 - 4);
    expect(count('subtract')).toBe(16 - 4);
    expect(count('intersect')).toBe(4);
    expect(MASK_DESCRIPTOR_SCHEMA.safeParse({ by: 'combine', op: 'add', of: [big] }).success).toBe(false);
  });

  it('turns a described mask into a real mask inside a step', () => {
    const rig = openRig();
    rig.paint(MARKS[0], 5);
    const artwork = rig.host.view(rig.documentId)?.state.artwork;
    if (!artwork) throw new Error('no artwork');
    const steps = toCommandSteps(
      [{ name: 'pixels.clear', targets: { sprites: [rig.target().sprite.id], layers: { by: 'all' }, frames: { by: 'all' } }, options: { mask: { by: 'colour', index: 5 } } }],
      artwork,
    );
    expect(steps.ok).toBe(true);
    const options = steps.ok ? steps.value[0]?.options : null;
    expect(options && typeof options === 'object' && 'mask' in options ? countOn(options.mask as MaskView) : -1).toBe(3);
  });

  it('accepts the descriptor shapes and refuses an unknown one', () => {
    expect(MASK_DESCRIPTOR_SCHEMA.safeParse({ by: 'wand', x: 1, y: 2 }).success).toBe(true);
    expect(MASK_DESCRIPTOR_SCHEMA.safeParse({ by: 'saved', name: 'a' }).success).toBe(true);
    expect(MASK_DESCRIPTOR_SCHEMA.safeParse({ by: 'magic' }).success).toBe(false);
  });
});
