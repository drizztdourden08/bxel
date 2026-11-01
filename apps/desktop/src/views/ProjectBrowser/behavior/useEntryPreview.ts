/* @layer renderer-app @kind hook */
import { findAnimation } from '@bxel/document';
import type { AnimationId } from '@bxel/document';
import { useMemo } from 'react';
import { animationPreviewTags } from '../../../asset-overview/animation-preview-tags';
import { previewOf } from '../../../asset-overview/preview-of';
import { DEFAULT_LOOP, NO_TAGS } from '../../../asset-preview/asset-preview.constants';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from './useBrowserContext';

const useEntryPreview = (entry: FileEntry, flipped?: ReadonlySet<string>) => {
  const { model } = useBrowserContext();
  const artwork = model.artwork;
  const key = entry.key;
  const preview = useMemo(() => (artwork && key ? previewOf(artwork, key, flipped) : null), [artwork, key, flipped]);
  const animated = artwork && key?.kind === 'animation' ? findAnimation(artwork, key.id as AnimationId) : undefined;
  const tags = useMemo(() => (artwork && key?.kind === 'animation' ? animationPreviewTags(artwork, key.id) : NO_TAGS), [artwork, key]);
  return { preview, loop: animated?.loop ?? DEFAULT_LOOP, tags };
};

export { useEntryPreview };
