/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { allowPress } from '../../src/editor/allow-press';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitSession } from '../../src/editor/commit-session';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { stepHistory } from '../../src/editor/step-history';
import { addMissingLayers } from '../../src/sheet/add-missing-layers';
import { broadcastGroup } from '../../src/sheet/broadcast-group';
import { checkBroadcast } from '../../src/sheet/check-broadcast';
import { currentScene } from '../../src/sheet/current-scene';
import { mismatchModel } from '../../src/sheet/mismatch-model';
import { narrowSelection } from '../../src/sheet/narrow-selection';
import { paintScope } from '../../src/sheet/paint-scope';
import { pickSpriteById } from '../../src/sheet/pick-sprite-by-id';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { toggleBroadcast } from '../../src/sheet/toggle-broadcast';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { plainOptions } from '../editor/editor-harness';
import { idOf, openFile, pixelsOf, spriteOf } from './sheet-harness';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('no target');
  return target;
};

const stroke = (x: number, y: number) => commitSession(beginStroke({ target: live(), tool: 'pencil', index: 3, options: plainOptions, at: { x, y } }));

const pickAll = (names: readonly string[]): void => {
  const [first, ...rest] = names;
  if (first === undefined) return;
  pickSpriteById(idOf(first), 'replace');
  for (const name of rest) pickSpriteById(idOf(name), 'toggle');
  useSpriteStore.getState().setActive(idOf(first));
};

const painted = (name: string, x: number, y: number): number => pixelsOf(name)[y * spriteOf(name).width + x] ?? 0;

beforeEach(() => openFile(['b', 'c'], 32));

describe('the compatibility check', () => {
  it('accepts sprites of one size, one palette and the same layer name', () => {
    const scene = currentScene();
    if (!scene?.active) throw new Error('no scene');
    const check = checkBroadcast(scene.active, 'Layer 1', scene.sprites);
    expect(check.gaps).toEqual([]);
    expect(check.ok).toHaveLength(3);
  });

  it('names a sprite that lacks the layer, has another size or uses another palette', () => {
    const scene = currentScene();
    const [first, second, third] = scene?.sprites ?? [];
    if (!first || !second || !third) throw new Error('missing sprites');
    expect(checkBroadcast(first, 'Outline', [first, second]).gaps.map((gap) => gap.reason)).toEqual(['layer']);
    expect(checkBroadcast(first, 'layer 1', [first, second]).gaps).toEqual([]);
    expect(checkBroadcast(first, 'Layer 1', [first, { ...second, width: 16 }]).gaps.map((gap) => gap.reason)).toEqual(['size']);
    expect(checkBroadcast(first, 'Layer 1', [first, { ...third, bankId: 'bnk_other' as typeof third.bankId }]).gaps.map((gap) => gap.reason)).toEqual(['palette']);
    expect(checkBroadcast(first, 'Outline', [first, { ...second, width: 16 }], false).gaps.map((gap) => gap.reason)).toEqual(['layer']);
  });

  it('uses the broadcast group only when the active sprite is picked with another', () => {
    pickAll(['b', 'c']);
    const scene = currentScene();
    if (!scene) throw new Error('no scene');
    expect(broadcastGroup(scene, false)).toEqual([]);
    expect(broadcastGroup(scene, true)).toHaveLength(2);
    expect(broadcastGroup({ ...scene, selected: scene.selected.slice(0, 1) }, true)).toEqual([]);
  });
});

describe('a shared stroke', () => {
  it('paints one stroke at the same local coordinates on every picked sprite as one undo step', () => {
    pickAll(['sprite', 'b', 'c']);
    toggleBroadcast();
    const scope = paintScope(live());
    expect(scope.sprites).toHaveLength(3);
    expect(scope.layers).toEqual({ by: 'names', names: ['Layer 1'] });
    expect(stroke(5, 6)?.ok).toBe(true);
    for (const name of ['sprite', 'b', 'c']) expect(painted(name, 5, 6)).toBe(3);
    stepHistory('undo');
    for (const name of ['sprite', 'b', 'c']) expect(painted(name, 5, 6)).toBe(0);
  });

  it('paints only the active sprite while Paint all selected is off', () => {
    pickAll(['sprite', 'b', 'c']);
    expect(paintScope(live()).sprites).toHaveLength(1);
    expect(stroke(1, 1)?.ok).toBe(true);
    expect(painted('sprite', 1, 1)).toBe(3);
    expect(pixelsOf('b')).toEqual([]);
  });

  it('is refused until the missing layer is added, then paints every picked sprite', () => {
    pickAll(['sprite', 'b', 'c']);
    const first = idOf('sprite');
    runDocument('Add layer', [{ name: COMMAND_NAME.layerAdd, targets: spritesTarget([first]), options: { name: 'Outline' } }]);
    const outline = spriteOf('sprite').layers.find((layer) => layer.name === 'Outline');
    useToolStore.getState().setLayer(outline?.id ?? null);
    toggleBroadcast();
    const scene = currentScene();
    if (!scene) throw new Error('no scene');
    const model = mismatchModel(scene, 'Outline', broadcastGroup(scene, true), true);
    expect(model?.text).toBe('2 of 3 selected sprites do not have layer Outline.');
    expect(model?.layerGaps).toHaveLength(2);
    expect(model?.keep).toEqual([first]);
    expect(allowPress({ kind: 'stroke', slot: 'foreground', tool: 'pencil', line: false }, live())).toBe(false);
    if (!model) throw new Error('no mismatch');
    addMissingLayers(model);
    expect(spriteOf('b').layers.map((layer) => layer.name)).toEqual(['Layer 1', 'Outline']);
    expect(stroke(2, 2)?.ok).toBe(true);
    for (const name of ['sprite', 'b', 'c']) expect(painted(name, 2, 2)).toBe(3);
  });

  it('narrows the pick to the sprites that fit', () => {
    pickAll(['sprite', 'b', 'c']);
    narrowSelection([idOf('sprite'), idOf('c')]);
    expect(useSpriteStore.getState().selected).toEqual([idOf('sprite'), idOf('c')]);
    expect(useSpriteStore.getState().broadcast).toBe(false);
  });

  it('lists a sprite of another size as a mismatch that only narrowing fixes', () => {
    openFile(['small'], 8);
    pickAll(['sprite', 'small']);
    const scene = currentScene();
    if (!scene) throw new Error('no scene');
    const model = mismatchModel(scene, 'Layer 1', scene.selected, true);
    expect(model?.text).toBe('1 of 2 selected sprites cannot take this edit: their sizes differ.');
    expect(model?.layerGaps).toEqual([]);
    expect(model?.keep).toEqual([idOf('sprite')]);
  });
});
