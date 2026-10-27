/* @layer core @kind logic */
import type { BundleId, Level } from '../catalogue/catalogue.type';
import type { ToolName } from '../tools/tool.type';
import { bundleLevel } from './bundle-level';
import type { Grant } from './grant.type';
import { lowerLevel } from './lower-level';
import { toolLevel } from './tool-level';

const itemLevel = (grant: Grant, tool: ToolName, bundle: BundleId): Level => lowerLevel(toolLevel(grant, tool), bundleLevel(grant, bundle));

export { itemLevel };
