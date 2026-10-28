/* @layer renderer-app @kind logic */
import type { GuideAxis } from '../guides/guide.type';
import { NO_GUIDES } from './useSurfaceGuideStore.constants';
import type { ViewGuides } from './surface-guide-store.type';

const sorted = (values: readonly number[]): number[] => [...new Set(values)].sort((a, b) => a - b);

const withGuideLine = (guides: ViewGuides | undefined, axis: GuideAxis, line: readonly number[]): ViewGuides => ({
  ...(guides ?? NO_GUIDES),
  [axis]: sorted(line),
});

export { withGuideLine };
