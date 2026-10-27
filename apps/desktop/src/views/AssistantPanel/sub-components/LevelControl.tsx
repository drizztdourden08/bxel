/* @layer renderer-app @kind component */
import type { Level } from '@bxel/mcp';
import { SegmentedControl } from '@drizztdourden08/tessera';
import type { LevelControlProps } from './LevelControl.type';

const LevelControl = ({ name, level, options, onChange }: LevelControlProps) => (
  <SegmentedControl<Level> aria-label={name} value={level} options={options.map((option) => ({ ...option }))} onChange={onChange} />
);

export { LevelControl };
