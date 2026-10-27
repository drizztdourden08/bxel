/* @layer renderer-app @kind logic */
import { ASSET_FORMAT, fileSafeStem } from '@bxel/document';
import type { Artwork, AssetKey, DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import { adoptPath } from '../../workspace/adopt-path';
import { assetName } from '../../workspace/asset-name';
import { takenIn } from '../../workspace/taken-in';
import { uniquePath } from '../../workspace/unique-path';
import { NAME_FALLBACK } from '../../workspace/workspace.constants';
import type { Workspace } from '../../workspace/workspace.type';
import type { ToolContext } from '../assistant.type';
import { checkNewPath } from './check-new-path';
import { hiddenAssets } from './hidden-assets';
import type { Blocked, Plan, Planned, Roots } from './place-dependencies.type';
import { TOOL_TEXT } from './tools.constants';
import { unplacedAssets } from './unplaced-assets';

const takenPaths = (): Set<string> =>
  new Set(Object.values(useWorkspaceStore.getState().workspaces).flatMap((each) => [...each.paths.values()].map((path) => path.toLowerCase())));

const describe = (artwork: Artwork, key: AssetKey): string => `${key.kind} "${assetName(artwork, key) ?? key.id}" (${key.id})`;

const planOne = async (
  context: ToolContext,
  artwork: Artwork,
  step: { readonly key: AssetKey; readonly where: string | null },
  taken: Set<string>,
): Promise<Planned | Blocked> => {
  const { key, where } = step;
  const name = assetName(artwork, key);
  if (where === null || name === null) return { key, reason: TOOL_TEXT.noFolderForAsset };
  for (const onDisk of await takenIn(context.documents, where)) taken.add(onDisk);
  const path = uniquePath(where, fileSafeStem(name, NAME_FALLBACK), ASSET_FORMAT[key.kind].extension, taken);
  const denied = checkNewPath(context, path);
  if (denied) return { key, reason: denied.error.message };
  taken.add(path.toLowerCase());
  return { key, path };
};

const planFor = async (context: ToolContext, workspace: Workspace, keys: readonly AssetKey[], dir: string | null): Promise<Plan> => {
  const artwork = context.host.view(workspace.documentId)?.state.artwork;
  const taken = takenPaths();
  const planned: Planned[] = [];
  const blocked: Blocked[] = [];
  for (const key of keys) {
    const where = dir ?? workspace.dirs[key.kind] ?? workspace.root;
    const one = artwork ? await planOne(context, artwork, { key, where }, taken) : { key, reason: TOOL_TEXT.noFolderForAsset };
    if ('path' in one) planned.push(one);
    else blocked.push(one);
  }
  return { planned, blocked };
};

const placeDependencies = async (context: ToolContext, documentId: DocumentId, roots: Roots, dir: string | null): Promise<McpResult<readonly AssetKey[]>> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const artwork = context.host.view(documentId)?.state.artwork;
  if (!workspace || !artwork) return hiddenFailure('document');
  const missing = unplacedAssets({ workspace, artwork, hidden: hiddenAssets(context, documentId) }, roots.keys, roots.named);
  const { planned, blocked } = await planFor(context, workspace, missing, dir);
  if (blocked.length > 0) {
    const list = blocked.map(({ key, reason }) => `${describe(artwork, key)}: ${reason}`).join('; ');
    return mcpFailure(MCP_ERROR_CODE.DEPENDENCY_UNSAVED, TOOL_TEXT.dependencyUnsaved(list), { path: 'target' });
  }
  const claimed = await context.claim(planned.map((each) => each.path));
  for (const [at, { key, path }] of planned.entries()) adoptPath(context.host, documentId, key, claimed[at] ?? path);
  return { ok: true, value: planned.map((each) => each.key) };
};

export { placeDependencies };
