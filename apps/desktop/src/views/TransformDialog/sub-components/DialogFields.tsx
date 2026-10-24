/* @layer renderer-app @kind component */
import { usePendingStore } from '../../../stores/usePendingStore';
import type { DialogFieldsProps } from '../TransformDialog.type';
import { RotateFields } from './RotateFields';
import { ScaleFields } from './ScaleFields';

const DialogFields = ({ spec }: DialogFieldsProps) => {
  const revise = usePendingStore((state) => state.revise);
  return spec.kind === 'rotate' ? <RotateFields spec={spec} onChange={revise} /> : <ScaleFields spec={spec} onChange={revise} />;
};

export { DialogFields };
