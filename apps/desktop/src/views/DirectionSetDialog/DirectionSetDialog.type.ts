/* @layer renderer-app @kind types */
import type { DirectionSetSpec } from '../../direction-set/direction-set.type';

interface DirectionFormProps {
  spec: DirectionSetSpec;
  update: (change: Partial<DirectionSetSpec>) => void;
}

export type { DirectionFormProps };
