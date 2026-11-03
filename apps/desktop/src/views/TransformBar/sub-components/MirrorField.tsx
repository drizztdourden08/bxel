/* @layer renderer-app @kind component */
import { Checkbox } from '@drizztdourden08/tessera';
import { setMirror } from '../../../editor/transform/set-mirror';
import { useToolStore } from '../../../stores/useToolStore';
import { useTransformUiStore } from '../../../stores/useTransformUiStore';
import { TRANSFORM_BAR_TEXT } from '../TransformBar.constants';

const MirrorField = () => {
  const mirror = useTransformUiStore((state) => state.mirror);
  const symmetric = useToolStore((state) => state.symmetryX || state.symmetryY);
  if (!symmetric) return null;
  return <Checkbox size="sm" label={TRANSFORM_BAR_TEXT.mirror} title={TRANSFORM_BAR_TEXT.mirrorHint} checked={mirror} onChange={setMirror} />;
};

export { MirrorField };
