/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { OVERVIEW_KIND_LABEL } from '../../../asset-overview/asset-overview.constants';
import type { OverviewModel } from '../../../asset-overview/asset-overview.type';
import { factsOf } from '../../../asset-overview/facts-of';
import { linksOf } from '../../../asset-overview/links-of';
import { previewOf } from '../../../asset-overview/preview-of';
import { renameFocused } from '../../../asset-overview/rename-focused';
import { useSubject } from '../../../properties-subject/useSubject';
import { assetName } from '../../../workspace/asset-name';
import { useFileFacts } from './useFileFacts';

const useAssetOverview = (): OverviewModel | null => {
  const focus = useAssetFocus();
  const state = useSubject();
  const subject = state.status === 'ready' ? state.subject : null;
  const file = useFileFacts(subject?.path ?? undefined, subject?.dirty ?? false);
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
