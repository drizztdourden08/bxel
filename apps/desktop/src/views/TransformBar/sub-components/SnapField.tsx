/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import { ANGLE_SNAPS } from '../../../editor/transform/transform.constants';
import { useTransformUiStore } from '../../../stores/useTransformUiStore';
import { SNAP_OPTIONS, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';

const SnapField = () => {
  const angleSnap = useTransformUiStore((state) => state.angleSnap);
  const setAngleSnap = useTransformUiStore((state) => state.setAngleSnap);
  return (
    <Field label={TRANSFORM_BAR_TEXT.snap} inline size="sm">
      <Select
        size="sm"
        width="fit"
        aria-label={TRANSFORM_BAR_TEXT.snapName}
        options={SNAP_OPTIONS}
        value={String(angleSnap)}
        onChange={(value) => {
          const step = ANGLE_SNAPS.find((each) => String(each) === value);
          if (step !== undefined) setAngleSnap(step);
        }}
      />
    </Field>
  );
};

export { SnapField };
