/* @layer renderer-app @kind logic */
import { ACCESS_LEVELS } from '@bxel/project';
import type { AccessLevel } from '@bxel/project';

const isAccessLevel = (value: string): value is AccessLevel => (ACCESS_LEVELS as readonly string[]).includes(value);

export { isAccessLevel };
