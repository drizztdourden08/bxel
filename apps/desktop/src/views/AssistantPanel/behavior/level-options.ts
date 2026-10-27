/* @layer renderer-app @kind logic */
import { LEVELS } from '@bxel/mcp';
import { LEVEL_NAME } from '../ProgramGrant.constants';
import type { LevelLimits, LevelOption } from './grant-rows.type';

const levelOptions = (limits: LevelLimits): readonly LevelOption[] =>
  LEVELS.map((value) => {
    const reason = value === 'disabled' ? undefined : limits[value];
    return reason === undefined ? { value, label: LEVEL_NAME[value] } : { value, label: LEVEL_NAME[value], disabled: reason };
  });

export { levelOptions };
