/* @layer core @kind logic */
import type { Level } from '../catalogue/catalogue.type';
import { LEVEL_RANK } from '../catalogue/level.constants';
import { rowsOf } from '../catalogue/rows-of';
import type { ToolName } from '../tools/tool.type';
import type { Grant } from './grant.type';
import { rowLevel } from './row-level';

const toolLevel = (grant: Grant, tool: ToolName, input?: unknown): Level =>
  rowsOf(tool, input)
    .map((row) => rowLevel(grant, row))
    .reduce((best, level) => (LEVEL_RANK[level] > LEVEL_RANK[best] ? level : best), 'disabled' satisfies Level);

export { toolLevel };
