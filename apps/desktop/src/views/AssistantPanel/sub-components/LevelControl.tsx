/* @layer renderer-app @kind component */
import type { Level } from '@bxel/mcp';
import { SegmentedControl } from '@drizztdourden08/tessera';
import type { LevelOption } from '../behavior/grant-rows.type';

type LevelControlProps = {
  readonly name: string;
  readonly level: Level;
  readonly options: readonly LevelOption[];
  readonly onChange: (level: Level) => void;
};

const LevelControl = ({ name, level, options, onChange }: LevelControlProps) => (
  <SegmentedControl<Level> aria-label={name} value={level} options={options.map((option) => ({ ...option }))} onChange={onChange} />
);

export { LevelControl };
