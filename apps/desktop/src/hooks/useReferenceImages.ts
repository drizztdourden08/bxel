/* @layer renderer-app @kind hook */
import type { ReferenceImage } from '../asset-view/reference-image.type';
import { currentReferences } from '../reference-image/current-references';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { useActiveDocument } from './useActiveDocument';
import { useEditorTarget } from './useEditorTarget';

const useReferenceImages = (): readonly ReferenceImage[] => {
  useActiveDocument();
  useEditorTarget();
  useAssetViewStore((state) => state.views);
  return currentReferences();
};

export { useReferenceImages };
