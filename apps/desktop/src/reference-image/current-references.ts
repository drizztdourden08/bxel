/* @layer renderer-app @kind logic */
import type { ReferenceImage } from '../asset-view/reference-image.type';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { currentViewKey } from './current-view-key';

const NONE: readonly ReferenceImage[] = [];

const currentReferences = (): readonly ReferenceImage[] => {
  const key = currentViewKey();
  return (key === null ? undefined : useAssetViewStore.getState().views[key]?.references) ?? NONE;
};

export { currentReferences };
