/* @layer renderer-app @kind logic */
import { LIMIT_PRESETS, LIMIT_TEXT } from './palette-limit.constants';

const limitChoice = (limit: number): string => (LIMIT_PRESETS.includes(limit) ? String(limit) : LIMIT_TEXT.custom);

export { limitChoice };
