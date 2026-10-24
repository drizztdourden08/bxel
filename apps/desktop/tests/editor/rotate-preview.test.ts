/* @layer renderer-app @kind test */
import { COMMAND_NAME, counterIdSource, flattenFrame } from '@bxel/document';
import type { TransactionOk } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { DEFAULT_ARTWORK } from '../../src/documents/default-artwork.constants';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { activeTarget } from '../../src/editor/active-target';
import { commitRequest } from '../../src/editor/commit-request';
import type { EditorTarget } from '../../src/editor/editor.type';
import type { PendingEdit } from '../../src/editor/pending/pending.type';
import { pendingRequest } from '../../src/editor/pending/pending-request';
import { previewImage } from '../../src/editor/pending/preview-image';

const SIDE = 16;

const MARKS: readonly (readonly [number, readonly (readonly [number, number])[]])[] = [
  [3, [[2, 1], [2, 2], [2, 3], [2, 4], [3, 4], [4, 4]]],
  [5, [[9, 2], [10, 2], [10, 3]]],
  [9, [[6, 10], [7, 11], [8, 12]]],
];

const markedSprite = (): { host: DocumentHost; target: () => EditorTarget } => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const created = host.create({ ...DEFAULT_ARTWORK, sprite: { name: 'marks', width: SIDE, height: SIDE } });
  if (!created.ok) throw new Error(created.error.message);
  const target = (): EditorTarget => {
    const found = activeTarget(host.view(created.documentId));
    if (!found) throw new Error('the sprite has no target');
    return found;
  };
  for (const [index, cells] of MARKS) {
    const options = { points: cells.map(([x, y]) => ({ x, y })), brush: { shape: 'square', size: 1 }, index };
    const result = host.execute(commitRequest(target(), 'Mark', { name: COMMAND_NAME.pixelsPaint, options }));
    if (!result.ok) throw new Error(result.error.message);
  }
  return { host, target };
};

const rotation = (target: EditorTarget, angle: number): PendingEdit => ({
  documentId: target.documentId,
  sprites: [target.sprite.id],
  spec: { kind: 'rotate', angle, bounds: 'crop' },
  mask: null,
  editing: false,
});

const previewOf = (host: DocumentHost, target: EditorTarget, angle: number): TransactionOk => {
  const result = host.execute(pendingRequest(target, rotation(target, angle), 'preview'));
  if (!result.ok) throw new Error(result.error.message);
  return result;
};

describe('the rotate preview', () => {
  it.each([90, 180, 270, 45, 15])('paints the pixels that a commit at %i degrees leaves', (angle) => {
    const { host, target } = markedSprite();
    const before = target();
    const frame = previewImage(before, previewOf(host, before, angle));
    const committed = host.execute(pendingRequest(before, rotation(before, angle), 'commit'));
    expect(committed.ok).toBe(true);
    const after = target();
    expect(frame).not.toBeNull();
    expect([...(frame?.indices ?? [])]).toEqual([...flattenFrame(after.sprite, after.frameId)]);
  });

  it('turns the L at 90 degrees without dropping a pixel', () => {
    const { host, target } = markedSprite();
    const before = target();
    const frame = previewImage(before, previewOf(host, before, 90));
    const turned = Array.from({ length: SIDE * SIDE }, (_, at) => {
      const original = flattenFrame(before.sprite, before.frameId);
      return original[(SIDE - 1 - (at % SIDE)) * SIDE + Math.floor(at / SIDE)] ?? 0;
    });
    expect([...(frame?.indices ?? [])]).toEqual(turned);
  });
});
