/* @layer core @kind constants */
import type { ToolEntry, ToolRowId } from './catalogue.type';
import { SETTING_ROWS } from './setting-rows.constants';
import { TOOL_CATALOGUE } from './tool-catalogue.constants';

const plain = Object.entries(TOOL_CATALOGUE).filter(([name]) => name !== 'set_setting');

const perScope = Object.values(SETTING_ROWS).map((row) => [row, TOOL_CATALOGUE.set_setting] as const);

const TOOL_ROWS = Object.fromEntries([...plain, ...perScope]) as Readonly<Record<ToolRowId, ToolEntry>>;

export { TOOL_ROWS };
