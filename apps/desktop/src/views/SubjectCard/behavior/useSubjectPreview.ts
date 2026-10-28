/* @layer renderer-app @kind hook */
import { findAnimation } from '@bxel/document';
import type { AnimationId } from '@bxel/document';
import { useMemo } from 'react';
import { previewOf } from '../../../asset-overview/preview-of';
import type { Subject } from '../../../properties-subject/properties-subject.type';
import { DEFAULT_LOOP } from '../../../asset-preview/asset-preview.constants';

const useSubjectPreview = (subject: Subject) => {
  const { artwork, key } = subject.focus;
  const preview = useMemo(() => previewOf(artwork, key), [artwork, key]);
  const loop = key.kind === 'animation' ? (findAnimation(artwork, key.id as AnimationId)?.loop ?? DEFAULT_LOOP) : DEFAULT_LOOP;
  return { preview, loop };
};

export { useSubjectPreview };
