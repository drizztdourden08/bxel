/* @layer renderer-app @kind constants */
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { SYMMETRY_TEXT } from '../ViewPanel.constants';

const SYMMETRY_AXES: readonly { axis: SymmetryAxis; label: string }[] = [
  { axis: 'x', label: SYMMETRY_TEXT.mirrorX },
  { axis: 'y', label: SYMMETRY_TEXT.mirrorY },
];

export { SYMMETRY_AXES };
