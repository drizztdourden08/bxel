/* @layer renderer-app @kind test */
import { artworkCreate, counterIdSource, documentCommands } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import { buildTools } from '@bxel/mcp';
import type { SessionMode, ToolName, ToolOutcome } from '@bxel/mcp';
import type { ProjectGrant } from '@bxel/project';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { openProject } from '../../src/project/open-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { ROOT, rig, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { toolContext } from './tool-context';

type ToolRig = {
  readonly rig: Rig;
  readonly projectId: string;
  readonly folderId: string;
  readonly run: (tool: ToolName, input: unknown, grants: readonly ProjectGrant[], mode?: SessionMode) => Promise<ToolOutcome>;
};

const tools = buildTools(documentCommands);

const expectValid = (tool: ToolName, outcome: ToolOutcome): void => {
  const found = tools.find((candidate) => candidate.name === tool);
  const checked = found?.output.safeParse(outcome);
  if (checked?.success !== true) throw new Error(`${tool} answered a shape the contract refuses: ${checked ? JSON.stringify(checked.error.issues) : 'no such tool'}`);
};

const bxelBytes = (name: string): Uint8Array => {
  const ids = counterIdSource();
  const created = artworkCreate({
    options: { name, bank: { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] }, sprite: { name: 'hero', width: 8, height: 8 } },
    ids,
  });
  if (!created.ok) throw new Error(created.error.message);
  return encodeArtwork(created.state, null, () => 0);
};

const grantOf = (projectId: string, access: 'read' | 'edit', rootRealPath = ROOT): ProjectGrant => ({
  projectId: projectId as ProjectGrant['projectId'],
  rootRealPath,
  access,
  grantedAt: '2026-10-24T10:00:00.000Z',
});

const toolRig = async (): Promise<ToolRig> => {
  const base = rig();
  withManifest(base.disk);
  base.disk.picks.folder = ROOT;
  await openProject();
  const project = useProjectStore.getState().project;
  if (!project) throw new Error('the project did not open');
  const parts = { host: base.kit.host, paths: base.kit.paths, documents: base.disk.port };
  const run = async (tool: ToolName, input: unknown, grants: readonly ProjectGrant[], mode: SessionMode = 'edit'): Promise<ToolOutcome> => {
    const handler = TOOL_HANDLERS[tool];
    if (!handler) throw new Error(`no handler for ${tool}`);
    const outcome = (await handler(input, toolContext(parts, grants, mode))).outcome;
    expectValid(tool, outcome);
    return outcome;
  };
  return { rig: base, projectId: project.manifest.projectId, folderId: project.manifest.folders[0]?.folderId ?? '', run };
};

const fieldOf = (outcome: ToolOutcome, key: string): unknown => (outcome.ok ? outcome[key] : undefined);

const rowsOf = (outcome: ToolOutcome, key: string): readonly Record<string, unknown>[] => {
  const value = fieldOf(outcome, key);
  return Array.isArray(value) ? value.filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null) : [];
};

export { bxelBytes, fieldOf, grantOf, rowsOf, toolRig };
export type { ToolRig };
