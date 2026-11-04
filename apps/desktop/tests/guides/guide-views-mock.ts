/* @layer renderer-app @kind test */
import type { GuideViewsState } from './guide-views-state.type';

const guideViewsMock = (state: GuideViewsState) => ({
  useAssetViewStore: {
    getState: () => ({
      views: state.views,
      patch: (key: string, change: { guideColours: Record<string, string> }) => {
        state.views[key] = { ...state.views[key], ...change };
      },
    }),
  },
});

export { guideViewsMock };
