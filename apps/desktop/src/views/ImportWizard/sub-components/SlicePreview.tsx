/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import { paintSlices } from '../behavior/paint-slices';
import { sliceScale } from '../behavior/slice-scale';
import type { SlicePreviewProps } from '../ImportWizard.type';

const SlicePreview = ({ image, rects }: SlicePreviewProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const scale = sliceScale(image);
  useEffect(() => {
    if (ref.current) paintSlices(ref.current, image, rects);
  }, [image, rects, scale]);
  return (
    <Canvas
      ref={ref}
      className="import-wizard__slices"
      width={image.width * scale}
      height={image.height * scale}
      role="img"
      aria-label={IMPORT_TEXT.slicePreview}
    />
  );
};

export { SlicePreview };
