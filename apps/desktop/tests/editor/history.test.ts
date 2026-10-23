/* @layer renderer-app @kind test */
import type { Brush } from '@bxel/raster';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProject } from '../../src/documents/create-default-project';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitStroke } from '../../src/editor/commit-stroke';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { historyItem } from '../../src/editor/history-item';
import { runAction } from '../../src/editor/run-action';
import { runInstant } from '../../src/editor/run-instant';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';

const brush: Brush = { shape: 'square', size: 1 };

const liveTarget = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const activeView = () => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  if (!view) throw new Error('the store has no active view');
  return view;
};

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultProject(useDocumentStore.getState().host);
});

describe('the document store', () => {
  it('opens the default sprite as a clean 32 by 32 document with the Bxel 16 bank', () => {
    const { state, clean } = activeView();
    const sprite = state.project.sprites[0];
    expect(clean).toBe(true);
    expect(sprite).toMatchObject({ width: 32, height: 32 });
    expect(state.project.banks[0]).toMatchObject({ name: 'Bxel 16', cap: 16, transparent: true });
    expect(state.project.banks[0]?.slots).toHaveLength(16);
  });
});

describe('undo and redo', () => {
  it('steps one stroke back and forth through the host', () => {
    const session = beginStroke({ target: liveTarget(), tool: 'pencil', index: 4, brush, at: { x: 3, y: 3 } });
    expect(commitStroke(session)?.ok).toBe(true);
    expect(activeView()).toMatchObject({ clean: false, canUndo: true, canRedo: false });
    runAction({ kind: 'undo' });
    expect(activeView()).toMatchObject({ clean: true, canUndo: false, canRedo: true });
    runAction({ kind: 'redo' });
    expect(activeView()).toMatchObject({ clean: false, canUndo: true, canRedo: false });
  });

  it('fills with the front colour and undoes it', () => {
    useToolStore.getState().setForeground(6);
    runInstant('fill', liveTarget(), { x: 0, y: 0 }, 'foreground');
    expect(activeView().canUndo).toBe(true);
    runAction({ kind: 'undo' });
    expect(activeView().canUndo).toBe(false);
  });

  it('names the title bar items by what is left to do', () => {
    expect(historyItem('undo', true)).toMatchObject({ label: 'Undo', icon: 'undo-2', shortcut: 'Ctrl+Z' });
    expect(historyItem('undo', false).label).toBe('Nothing to undo');
    expect(historyItem('redo', true)).toMatchObject({ label: 'Redo', icon: 'redo-2' });
    expect(historyItem('redo', false).label).toBe('Nothing to redo');
  });
});
