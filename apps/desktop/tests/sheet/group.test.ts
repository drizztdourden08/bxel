/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { duplicateLayer } from '../../src/editor/duplicate-layer';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { cancelPending } from '../../src/editor/pending/cancel-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { scopeText } from '../../src/editor/pending/scope-text';
import { stepHistory } from '../../src/editor/step-history';
import { currentTarget } from '../../src/editor/current-target';
import { pickSpriteById } from '../../src/sheet/pick-sprite-by-id';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { idOf, openFile, pixelsOf, spriteOf } from './sheet-harness';

const patch = (name: string, rect: { x: number; y: number; width: number; height: number }, value: number): void => {
  const pixels = new Uint8Array(rect.width * rect.height).fill(value);
  runDocument('Paint', [{ name: COMMAND_NAME.pixelsPatch, targets: spritesTarget([idOf(name)]), options: { rect, pixels } }]);
};

const pickThree = (): void => {
  pickSpriteById(idOf('sprite'), 'replace');
  pickSpriteById(idOf('b'), 'toggle');
  pickSpriteById(idOf('c'), 'toggle');
};

const lastLabel = (): string => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? '' : (host.view(activeId)?.lastEvent.label ?? '');
};

const revision = (): number => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? 0 : (host.view(activeId)?.state.revision ?? 0);
};

beforeEach(() => {
  openFile(['b', 'c'], 32);
  patch('sprite', { x: 0, y: 0, width: 1, height: 1 }, 1);
  patch('b', { x: 0, y: 5, width: 1, height: 1 }, 2);
  patch('c', { x: 1, y: 0, width: 1, height: 1 }, 3);
});

describe('a flip on picked sprites', () => {
  it('shows every picked sprite in the preview and the Apply bar', () => {
    pickThree();
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    const { pending, outcome } = usePendingStore.getState();
    expect(pending?.sprites).toHaveLength(3);
    expect(outcome?.others).toHaveLength(2);
    const target = currentTarget();
    if (!target || !pending) throw new Error('no preview');
    expect(scopeText(target, pending)).toEqual({ targets: '3 sprites', layers: 'All layers', frames: 'All frames (1)' });
    cancelPending();
  });

  it('flips all three sprites as one undo step named for the count', () => {
    pickThree();
    const before = revision();
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(commitPending()).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(lastLabel()).toBe('Flip horizontal on 3 sprites');
    expect(pixelsOf('sprite')[31]).toBe(1);
    expect(pixelsOf('b')[5 * 32 + 31]).toBe(2);
    expect(pixelsOf('c')[30]).toBe(3);
    stepHistory('undo');
    expect(pixelsOf('sprite')[0]).toBe(1);
    expect(pixelsOf('b')[5 * 32]).toBe(2);
    expect(pixelsOf('c')[1]).toBe(3);
  });

  it('uses only the current sprite when the scope chip says so', () => {
    pickThree();
    useSpriteStore.getState().setSpritesScope('current');
    expect(beginPending({ kind: 'flip', axis: 'vertical' })).toBe(true);
    expect(usePendingStore.getState().pending?.sprites).toHaveLength(1);
    cancelPending();
  });

  it('turns sprites of different shapes with each own bounds in one step', () => {
    runDocument('New', [{ name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'tall', width: 4, height: 10 } }]);
    pickSpriteById(idOf('tall'), 'replace');
    pickSpriteById(idOf('sprite'), 'toggle');
    expect(beginPending({ kind: 'turn', direction: 'clockwise' })).toBe(true);
    expect(commitPending()).toBe(true);
    expect([spriteOf('tall').width, spriteOf('tall').height]).toEqual([10, 4]);
    expect([spriteOf('sprite').width, spriteOf('sprite').height]).toEqual([32, 32]);
    stepHistory('undo');
    expect([spriteOf('tall').width, spriteOf('tall').height]).toEqual([4, 10]);
  });

  it('keeps one sprite as one sprite', () => {
    pickSpriteById(idOf('b'), 'replace');
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(usePendingStore.getState().pending?.sprites).toEqual([idOf('b')]);
    expect(commitPending()).toBe(true);
    expect(lastLabel()).toBe('Flip horizontal');
  });
});

describe('layer duplication on picked sprites', () => {
  it('duplicates the layer of every picked sprite as one undo step', () => {
    pickThree();
    const before = revision();
    duplicateLayer();
    expect(revision()).toBe(before + 1);
    for (const name of ['sprite', 'b', 'c']) expect(spriteOf(name).layers.map((layer) => layer.name)).toEqual(['Layer 1', 'Layer 1 copy']);
    stepHistory('undo');
    expect(spriteOf('c').layers).toHaveLength(1);
  });

  it('asks for a fix when a picked sprite lacks the layer', () => {
    pickThree();
    runDocument('Add layer', [{ name: COMMAND_NAME.layerAdd, targets: spritesTarget([idOf('sprite')]), options: { name: 'Outline' } }]);
    useSpriteStore.getState().setActive(idOf('sprite'));
    const before = revision();
    duplicateLayer();
    expect(revision()).toBe(before);
    expect(useSpriteStore.getState().gap).toBe('Outline');
  });
});
