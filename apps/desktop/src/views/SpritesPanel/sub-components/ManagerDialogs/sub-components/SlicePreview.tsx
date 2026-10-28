/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { useSlicePreview } from '../behavior/useSlicePreview';
import type { SlicePreviewProps } from '../../../../../sheet-manager/dialog-form.type';

/** The first sprite at a whole number scale with an outline round every piece the cut would make, drawn before Apply. */
const SlicePreview = ({ artwork, sprite, plan }: SlicePreviewProps) => {
  const canvas = useSlicePreview(artwork, sprite, plan.rects);
  return <Canvas ref={canvas} className="slice-preview" role="img" aria-label={COMPOSE_TEXT.previewLabel} />;
};

export { SlicePreview };
