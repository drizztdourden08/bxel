/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { beginStroke } from '../../src/editor/begin-stroke';
import { extendStroke } from '../../src/editor/extend-stroke';
import { fillRequest } from '../../src/editor/fill-request';
import { strokeRequest } from '../../src/editor/stroke-request';
import { openEditor, plainOptions } from './editor-harness';

const rowStart = 33;
const crimson = [224, 36, 94, 255];

describe('a pencil stroke', () => {
  it('draws the live overlay and commits one transaction with the same pixels', () => {
    const { host, target, pixels } = openEditor();
    const kinds: string[] = [];
    host.subscribe((event) => kinds.push(event.kind));
    const session = beginStroke({ target: target(), tool: 'pencil', index: 5, options: plainOptions, at: { x: 1, y: 1 } });
    extendStroke(session, { x: 4, y: 1 });
    extendStroke(session, { x: 4, y: 1 });
    expect(session.points).toEqual([{ x: 1, y: 1 }, { x: 4, y: 1 }]);
    expect(Array.from(session.indices.subarray(rowStart, rowStart + 4))).toEqual([5, 5, 5, 5]);
    expect(Array.from(session.rgba.subarray(rowStart * 4, rowStart * 4 + 4))).toEqual(crimson);
    expect(pixels().subarray(rowStart, rowStart + 4)).toEqual(new Uint8Array(4));
    expect(kinds).toEqual([]);
    const result = host.execute(strokeRequest(target(), session));
    expect(result.ok).toBe(true);
    expect(kinds).toEqual(['commit']);
    expect(pixels()).toEqual(session.indices);
    expect(host.view(target().documentId)?.lastEvent.label).toBe('Pencil stroke');
  });

  it('undoes as one step', () => {
    const { host, documentId, target, pixels } = openEditor();
    const session = beginStroke({ target: target(), tool: 'pencil', index: 2, options: plainOptions, at: { x: 0, y: 0 } });
    extendStroke(session, { x: 6, y: 5 });
    host.execute(strokeRequest(target(), session));
    expect(host.undo(documentId).ok).toBe(true);
    expect(pixels().every((value) => value === 0)).toBe(true);
    expect(host.redo(documentId).ok).toBe(true);
    expect(pixels()).toEqual(session.indices);
  });
});

describe('an eraser stroke', () => {
  it('clears pixels in the overlay and in the commit', () => {
    const { host, target, pixels } = openEditor();
    const pencil = beginStroke({ target: target(), tool: 'pencil', index: 7, options: plainOptions, at: { x: 2, y: 2 } });
    extendStroke(pencil, { x: 5, y: 2 });
    host.execute(strokeRequest(target(), pencil));
    const eraser = beginStroke({ target: target(), tool: 'eraser', index: 7, options: plainOptions, at: { x: 3, y: 2 } });
    extendStroke(eraser, { x: 4, y: 2 });
    expect(eraser.index).toBe(0);
    host.execute(strokeRequest(target(), eraser));
    expect(Array.from(pixels().subarray(66, 70))).toEqual([7, 0, 0, 7]);
    expect(host.view(target().documentId)?.lastEvent.label).toBe('Eraser stroke');
  });
});

describe('a fill', () => {
  it('floods the empty sprite with the chosen index in one step', () => {
    const { host, documentId, target, pixels } = openEditor();
    const result = host.execute(fillRequest(target(), { x: 9, y: 9 }, { index: 3, mode: 'contiguous', connectivity: 4 }));
    expect(result.ok).toBe(true);
    expect(pixels().every((value) => value === 3)).toBe(true);
    expect(host.undo(documentId).ok).toBe(true);
    expect(pixels().every((value) => value === 0)).toBe(true);
  });
});
