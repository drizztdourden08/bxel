/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useCallback, useEffect, useRef } from 'react';
import { paintSurroundPreview } from '../../../canvas-look/paint-surround-preview';
import { useResizeRedraw } from '../../../hooks/useResizeRedraw';
import { SURROUND_EDITOR_TEXT } from '../SurroundEditor.constants';
import type { SurroundPreviewProps } from '../SurroundEditor.type';

const SurroundPreview = ({ look }: SurroundPreviewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const paint = useCallback(() => {
    if (ref.current) paintSurroundPreview(ref.current, look);
  }, [look]);
  useEffect(paint, [paint]);
  useResizeRedraw(ref, paint);
  return <Canvas ref={ref} className="surround-editor__preview" role="img" aria-label={SURROUND_EDITOR_TEXT.previewLabel} />;
};

export { SurroundPreview };
