/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { addMissingForName } from '../../src/sheet/add-missing-for-name';
import { activateSheetLayer } from '../../src/sheet/activate-sheet-layer';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { idOf, openFile, spriteOf } from './sheet-harness';

const hasLayer = (sprite: string, name: string): boolean => spriteOf(sprite).layers.some((layer) => layer.name === name);

describe('S1 the sheet layer list', { tags: ['standard'] }, () => {
  beforeEach(() => openFile(['a', 'b'], 4));

  it('adds a layer name only to the sprites that lack it', () => {
    const step = { name: COMMAND_NAME.layerAdd, targets: spritesTarget([idOf('a')]), options: { name: 'shadow' } };
    expect(runDocument('Add layer', [step])).not.toBeNull();
    expect(hasLayer('b', 'shadow')).toBe(false);
    addMissingForName([spriteOf('a'), spriteOf('b')], 'shadow');
    expect(hasLayer('a', 'shadow')).toBe(true);
    expect(hasLayer('b', 'shadow')).toBe(true);
  });

  it('picking a row sets the layer scope to the active layer', () => {
    useSpriteStore.getState().setLayerScope('all');
    activateSheetLayer('Layer 1');
    expect(useSpriteStore.getState().layerScope).toBe('active');
  });
});
