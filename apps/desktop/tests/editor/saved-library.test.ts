/* @layer renderer-app @kind test */
import { encodeBrushPixels } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { runLibraryAction } from '../../src/editor/brush-library-run';
import { inkOf } from '../../src/editor/ink-of';
import { patternStencilId } from '../../src/editor/pattern-stencil-id';
import { savedPattern } from '../../src/editor/saved-pattern';
import { savedPatterns } from '../../src/editor/saved-patterns';
import { stepRequest } from '../../src/transactions/step-request';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { resetEditor, tools } from './option-harness';

beforeEach(resetEditor);

const drawing = () => useDrawingStore.getState();

const addPattern = (): string => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null) throw new Error('no document');
  const options = { name: 'Checks', width: 2, height: 2, pixels: encodeBrushPixels(new Uint8Array([1, 0, 0, 1])) };
  const result = host.execute(stepRequest(host, activeId, 'New pattern', [{ name: 'pattern.add', targets: null, ref: 'p', options }]));
  const id = result.ok ? result.created.p : undefined;
  if (id === undefined) throw new Error('the pattern was not added');
  return id;
};

describe('W8 saved dither patterns', { tags: ['critical'] }, () => {
  it('lists a saved pattern and renames it through the document', () => {
    const id = addPattern();
    expect(savedPatterns().map((pattern) => pattern.name)).toEqual(['Checks']);
    expect(runLibraryAction({ kind: 'pattern', action: 'rename', id, name: 'Fine checks' })).toBe(true);
    expect(savedPattern(id)?.name).toBe('Fine checks');
  });

  it('feeds the dither ink with the chosen pattern', () => {
    const id = addPattern();
    drawing().patch({ patternId: id });
    drawing().setInk('pencil', 'dither');
    tools().selectTool('pencil');
    expect(patternStencilId(drawing(), false)).toBe(id);
    expect(inkOf('foreground', tools(), drawing()).ink).toMatchObject({ kind: 'dither', brushId: id });
  });

  it('forgets the pattern when it is deleted', () => {
    const id = addPattern();
    drawing().patch({ patternId: id });
    expect(runLibraryAction({ kind: 'pattern', action: 'remove', id })).toBe(true);
    expect(savedPatterns()).toHaveLength(0);
    expect(drawing().patternId).toBeNull();
  });
});
