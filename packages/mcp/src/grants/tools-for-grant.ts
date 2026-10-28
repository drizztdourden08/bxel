/* @layer core @kind logic */
import type { Level } from '../catalogue/catalogue.type';
import { LEVEL_LABEL } from '../catalogue/level.constants';
import { ROUTED_BUNDLES } from '../catalogue/step-bundle.constants';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { ToolDescriptor } from '../tools/tool-descriptor.type';
import type { ToolName } from '../tools/tool.type';
import { atLeast } from './at-least';
import { bundleLabel } from './bundle-label';
import { GRANT_TEXT } from './grant-text.constants';
import type { Grant } from './grant.type';
import { itemLevel } from './item-level';
import { toolLevel } from './tool-level';

const isListed = (grant: Grant, tool: ToolName): boolean => {
  if (grant.blocked || toolLevel(grant, tool) === 'disabled') return false;
  const entry = TOOL_CATALOGUE[tool];
  if (entry.special !== undefined && !grant.special[entry.special]) return false;
  return entry.routed !== 'steps' || ROUTED_BUNDLES.some((bundle) => itemLevel(grant, tool, bundle) !== 'disabled');
};

const routedNote = (grant: Grant, tool: ToolName): string | null => {
  const needed: Level = TOOL_CATALOGUE[tool].kind === 'read' ? 'read' : 'edit';
  const limited = ROUTED_BUNDLES.filter((bundle) => !atLeast(itemLevel(grant, tool, bundle), needed));
  if (limited.length === 0) return null;
  return GRANT_TEXT.stepsNote(limited.map((bundle) => `${bundleLabel(bundle)} (${LEVEL_LABEL[itemLevel(grant, tool, bundle)]})`).join(', '));
};

const plainNote = (grant: Grant, tool: ToolName): string | null => {
  const { kind, routed } = TOOL_CATALOGUE[tool];
  if (kind === 'read' || toolLevel(grant, tool) !== 'read') return null;
  if (routed === 'command') return GRANT_TEXT.commandNote;
  return kind === 'mixed' ? GRANT_TEXT.levelNote : GRANT_TEXT.writeNote;
};

const noteOf = (grant: Grant, tool: ToolName): string | null =>
  TOOL_CATALOGUE[tool].routed === 'steps' ? routedNote(grant, tool) : plainNote(grant, tool);

const toolsForGrant = (tools: readonly ToolDescriptor[], grant: Grant): readonly ToolDescriptor[] =>
  tools
    .filter((tool) => isListed(grant, tool.name))
    .map((tool) => {
      const note = noteOf(grant, tool.name);
      return note === null ? tool : { ...tool, description: `${tool.description} ${note}` };
    });

export { toolsForGrant };
