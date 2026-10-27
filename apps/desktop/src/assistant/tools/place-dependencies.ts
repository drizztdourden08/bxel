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
import { TOOL_TEXT } from './tools.constants';
import { unplacedAssets } from './unplaced-assets';

type Planned = { readonly key: AssetKey; readonly path: string };

type Roots = { readonly keys: readonly AssetKey[]; readonly named?: readonly AssetKey[] };

const takenPaths = (): Set<string> =>
  new Set(Object.values(useWorkspaceStore.getState().workspaces).flatMap((each) => [...each.paths.values()].map((path) => path.toLowerCase())));

const describe = (artwork: Artwork, key: AssetKey): string => `${key.kind} "${assetName(artwork, key) ?? key.id}" (${key.id})`;

const planFor = async (context: ToolContext, workspace: Workspace, artwork: Artwork, keys: readonly AssetKey[], dir: string | null) => {
  const taken = takenPaths();
  const planned: Planned[] = [];
  const blocked: { readonly key: AssetKey; readonly reason: string }[] = [];
  for (const key of keys) {
    const where = dir ?? workspace.dirs[key.kind] ?? workspace.root;
    const name = assetName(artwork, key);
    if (where === null || where === undefined || name === null) {
      blocked.push({ key, reason: TOOL_TEXT.noFolderForAsset });
      continue;
    }
    for (const onDisk of await takenIn(context.documents, where)) taken.add(onDisk);
    const path = uniquePath(where, fileSafeStem(name, NAME_FALLBACK), ASSET_FORMAT[key.kind].extension, taken);
    const denied = checkNewPath(context, path);
    if (denied) {
      blocked.push({ key, reason: denied.error.message });
      continue;
    }
    taken.add(path.toLowerCase());
    planned.push({ key, path });
  }
  return { planned, blocked };
};

const placeDependencies = async (context: ToolContext, documentId: DocumentId, roots: Roots, dir: string | null): Promise<McpResult<readonly AssetKey[]>> => {
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const artwork = context.host.view(documentId)?.state.artwork;
  if (!workspace || !artwork) return hiddenFailure('document');
  const missing = unplacedAssets({ workspace, artwork, hidden: hiddenAssets(context, documentId) }, roots.keys, roots.named);
  const { planned, blocked } = await planFor(context, workspace, artwork, missing, dir);
  if (blocked.length > 0) {
    const list = blocked.map(({ key, reason }) => `${describe(artwork, key)}: ${reason}`).join('; ');
    return mcpFailure(MCP_ERROR_CODE.DEPENDENCY_UNSAVED, TOOL_TEXT.dependencyUnsaved(list), { path: 'target' });
  }
  for (const { key, path } of planned) adoptPath(context.host, documentId, key, path);
  return { ok: true, value: planned.map((each) => each.key) };
};

export { placeDependencies };
export type { Roots };
