/* @layer renderer-app @kind logic */
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { NONE } from './current-guide-colours.constants';

const currentGuideColours = (): Readonly<Record<string, string>> => {
  const key = currentViewKey();
  return (key === null ? undefined : useAssetViewStore.getState().views[key]?.guideColours) ?? NONE;
};

export { currentGuideColours };
