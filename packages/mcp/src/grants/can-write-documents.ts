/* @layer core @kind logic */
import { ROUTED_BUNDLES } from '../catalogue/step-bundle.constants';
import { TOOL_CATALOGUE } from '../catalogue/tool-catalogue.constants';
import type { ToolName } from '../tools/tool.type';
import { bundleLevel } from './bundle-level';
import { DOCUMENT_BUNDLES } from './document-bundles.constants';
import type { Grant } from './grant.type';
import { toolLevel } from './tool-level';

const writesDocuments = (grant: Grant, tool: ToolName): boolean => {
  const entry = TOOL_CATALOGUE[tool];
  if (entry.kind !== 'write' || !DOCUMENT_BUNDLES.includes(entry.bundle) || toolLevel(grant, tool) !== 'edit') return false;
  return entry.routed === undefined || ROUTED_BUNDLES.some((bundle) => bundleLevel(grant, bundle) === 'edit');
};

const canWriteDocuments = (grant: Grant): boolean => (Object.keys(TOOL_CATALOGUE) as ToolName[]).some((tool) => writesDocuments(grant, tool));

export { canWriteDocuments };
