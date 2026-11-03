/* @layer renderer-app @kind test */
import { SET_VIEW_INPUT_SCHEMA } from '@bxel/mcp';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guideColoursStep } from '../../src/assistant/tools/guide-colours-step';
import { guideColoursView } from '../../src/assistant/tools/guide-colours-view';
import { storePathBook } from '../../src/files/store-path-book';
import { currentGuideColours } from '../../src/guides/current-guide-colours';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { toolContext } from '../project/tool-context';

const state = vi.hoisted((): { key: string | null; views: Record<string, { guideColours: Record<string, string> }> } => ({ key: 'view', views: {} }));

vi.mock('../../src/reference-image/current-view-key', () => ({ currentViewKey: () => state.key }));
vi.mock('../../src/stores/useAssetViewStore', () => ({
  useAssetViewStore: {
    getState: () => ({
      views: state.views,
      patch: (key: string, change: { guideColours: Record<string, string> }) => {
        state.views[key] = { ...state.views[key], ...change };
      },
    }),
  },
}));

const run = (guideColours: { axis: 'x' | 'y'; position: number; colour: string | null }[]) => {
  const { host } = useDocumentStore.getState();
  const context = toolContext({ host, paths: storePathBook(host), documents: {} as DocumentsPort });
  return guideColoursStep(SET_VIEW_INPUT_SCHEMA.parse({ guideColours }), context);
};

describe('W10 an assistant reads and sets guide colours', { tags: ['standard'] }, () => {
  beforeEach(() => {
    state.key = 'view';
    state.views = { view: { guideColours: {} } };
  });

  it('colours guides and clears one with null', () => {
    expect(run([{ axis: 'x', position: 4, colour: '#ff4d6a' }, { axis: 'y', position: 2, colour: '#4da3ff' }])).toBeNull();
    expect(currentGuideColours()).toEqual({ 'x:4': '#ff4d6a', 'y:2': '#4da3ff' });
    run([{ axis: 'x', position: 4, colour: null }]);
    expect(currentGuideColours()).toEqual({ 'y:2': '#4da3ff' });
  });

  it('reads the colours back as axis, position and colour', () => {
    run([{ axis: 'y', position: 7, colour: '#4dd98a' }]);
    expect(guideColoursView()).toEqual([{ axis: 'y', position: 7, colour: '#4dd98a' }]);
  });

  it('refuses while no asset is open', () => {
    state.key = null;
    expect(run([{ axis: 'x', position: 1, colour: '#ffffff' }])).not.toBeNull();
  });
});
