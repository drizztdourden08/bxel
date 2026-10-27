/* @layer renderer-app @kind logic */
import { BUNDLE_IDS, ROUTED_BUNDLES, TOOL_CATALOGUE } from '@bxel/mcp';
import type { BundleId, Grant } from '@bxel/mcp';
import { GRANT_TEXT_UI } from '../sub-components/ProgramGrant.constants';
import { bundleDef } from './bundle-def';
import type { BundleRowModel, ToolRowModel } from './grant-rows.type';
import { levelOptions } from './level-options';
import { shownLevel } from './shown-level';
import { toolRow } from './tool-row';
import { toolsOfBundle } from './tools-of-bundle';

const wordsOf = (query: string): readonly string[] => query.toLowerCase().split(/\s+/).filter((word) => word !== '');

const hits = (words: readonly string[], ...texts: readonly string[]): boolean => {
  const hay = texts.join(' ').toLowerCase();
  return words.every((word) => hay.includes(word));
};

const onlyReads = (bundle: BundleId): boolean => {
  const ids = toolsOfBundle(bundle);
  return ids.length > 0 && ids.every((id) => TOOL_CATALOGUE[id].kind === 'read');
};

const noteOf = (bundle: BundleId, tools: readonly ToolRowModel[]): string | null => {
  if (tools.length > 0) return null;
  return ROUTED_BUNDLES.includes(bundle) ? GRANT_TEXT_UI.routedGroup : GRANT_TEXT_UI.noTools;
};

const bundleRow = (grant: Grant, id: BundleId, words: readonly string[]): BundleRowModel | null => {
  const def = bundleDef(id);
  const reads = onlyReads(id);
  const own = hits(words, def.label, def.description);
  const all = toolsOfBundle(id).map((tool) => toolRow(grant, tool));
  const tools = own ? all : all.filter((tool) => hits(words, tool.id, tool.description));
  if (words.length > 0 && !own && tools.length === 0) return null;
  return {
    id,
    label: def.label,
    description: def.description,
    level: shownLevel(grant.bundles[id], reads ? 'read' : 'mixed'),
    overrides: all.filter((tool) => tool.overridden).length,
    options: levelOptions(reads ? { edit: GRANT_TEXT_UI.groupOnlyReads } : {}),
    name: GRANT_TEXT_UI.groupName(def.label),
    note: noteOf(id, all),
    tools,
  };
};

const bundleRows = (grant: Grant, query: string): readonly BundleRowModel[] => {
  const words = wordsOf(query);
  return BUNDLE_IDS.flatMap((id) => bundleRow(grant, id, words) ?? []);
};

export { bundleRows };
