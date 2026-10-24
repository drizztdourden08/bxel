/* @layer renderer-app @kind test */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { beginPending } from '../../src/editor/pending/begin-pending';
import { cancelPending } from '../../src/editor/pending/cancel-pending';
import { commitPending } from '../../src/editor/pending/commit-pending';
import { PENDING_DEFAULTS } from '../../src/stores/pending-store.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { usePendingStore } from '../../src/stores/usePendingStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { ApplyBar } from '../../src/views/ApplyBar';

const markup = (): string => renderToStaticMarkup(createElement(ApplyBar));

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  usePendingStore.setState({ ...PENDING_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
});

const showing = (): boolean => {
  const { pending, outcome } = usePendingStore.getState();
  return pending !== null && !pending.editing && outcome !== null;
};

describe('the floating Apply bar', () => {
  it('draws nothing while no edit waits', () => {
    expect(showing()).toBe(false);
    expect(markup()).toBe('');
  });

  it('has an outcome to show while an edit waits and leaves with Cancel', () => {
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(showing()).toBe(true);
    cancelPending();
    expect(showing()).toBe(false);
  });

  it('leaves after Apply commits the edit', () => {
    expect(beginPending({ kind: 'flip', axis: 'horizontal' })).toBe(true);
    expect(commitPending()).toBe(true);
    expect(showing()).toBe(false);
  });
});
