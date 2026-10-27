/* @layer renderer-app @kind types */
import type { Level } from '@bxel/mcp';
import type { LevelOption } from '../behavior/grant-rows.type';

type LevelControlProps = {
  readonly name: string;
  readonly level: Level;
  readonly options: readonly LevelOption[];
  readonly onChange: (level: Level) => void;
};

export type { LevelControlProps };
