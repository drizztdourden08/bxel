/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { OVERVIEW_KIND_LABEL } from '../../../asset-overview/asset-overview.constants';
import type { OverviewModel } from '../../../asset-overview/asset-overview.type';
import { factsOf } from '../../../asset-overview/facts-of';
import { linksOf } from '../../../asset-overview/links-of';
import { previewOf } from '../../../asset-overview/preview-of';
import { renameFocused } from '../../../asset-overview/rename-focused';
import { useActiveAsset } from '../../../hooks/useActiveAsset';
import { assetName } from '../../../workspace/asset-name';
import { useFileFacts } from './useFileFacts';

const useAssetOverview = (): OverviewModel | null => {
  const focus = useAssetFocus();
  const active = useActiveAsset();
  const file = useFileFacts(active?.path, active?.dirty ?? false);
  return useMemo(() => {
    if (focus === null) return null;
    const preview = previewOf(focus.artwork, focus.key);
    return {
      focus,
      name: assetName(focus.artwork, focus.key) ?? '',
      kindLabel: OVERVIEW_KIND_LABEL[focus.key.kind],
      preview,
      facts: factsOf(focus, preview, file),
      links: linksOf(focus.artwork, focus.key),
      rename: (name: string) => renameFocused(focus, name),
    };
  }, [focus, file]);
};

export { useAssetOverview };
