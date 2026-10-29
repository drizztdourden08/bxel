/* @layer core @kind logic */
import type { Level, ToolRowId } from '../catalogue/catalogue.type';
import { TOOL_ROWS } from '../catalogue/tool-rows.constants';
import { bundleLevel } from './bundle-level';
import type { Grant } from './grant.type';

const rowLevel = (grant: Grant, row: ToolRowId): Level => {
  const entry = TOOL_ROWS[row];
  return grant.tools[row] ?? (entry.routed === 'steps' ? 'edit' : bundleLevel(grant, entry.bundle));
};

export { rowLevel };
