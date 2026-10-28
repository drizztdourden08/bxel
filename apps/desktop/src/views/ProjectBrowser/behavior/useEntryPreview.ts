/* @layer renderer-app @kind hook */
import { findAnimation } from '@bxel/document';
import type { AnimationId } from '@bxel/document';
import { useMemo } from 'react';
import { DEFAULT_LOOP } from '../../../asset-preview/asset-preview.constants';
import { previewOf } from '../../../asset-overview/preview-of';
import type { FileEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from './browser-context';

/** The big picture of one file for the preview pane, drawn from the open document. A closed project has stored pictures only. */
const useEntryPreview = (entry: FileEntry) => {
  const { model } = useBrowserContext();
  const artwork = model.artwork;
  const key = entry.key;
  const preview = useMemo(() => (artwork && key ? previewOf(artwork, key) : null), [artwork, key]);
  const loop = artwork && key?.kind === 'animation' ? (findAnimation(artwork, key.id as AnimationId)?.loop ?? DEFAULT_LOOP) : DEFAULT_LOOP;
  return { preview, loop };
};

export { useEntryPreview };
