/* @layer renderer-app @kind test */
import { artworkCreate, counterIdSource, documentCommands } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import { buildTools } from '@bxel/mcp';
import type { SessionMode, ToolCall, ToolName, ToolOutcome } from '@bxel/mcp';
import type { ProjectDocument, ProjectGrant } from '@bxel/project';
import type { AssistantSettings } from '../../src/assistant/assistant.type';
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
  readonly grants: (access?: 'read' | 'edit') => readonly ProjectGrant[];
  readonly locate: (path: string) => { readonly projectId: string; readonly folderId: string; readonly path: string };
  readonly run: (tool: ToolName, input: unknown, grants: readonly ProjectGrant[], mode?: SessionMode) => Promise<ToolOutcome>;
  readonly runWith: (tool: ToolName, input: unknown, setup: RunSetup) => Promise<ToolOutcome>;
};

type RigOptions = {
  readonly seed?: (disk: Rig['disk']) => void;
  readonly manifest?: ProjectDocument;
};

type RunSetup = {
  readonly grants: readonly ProjectGrant[];
  readonly mode?: SessionMode;
  readonly settings?: Partial<AssistantSettings>;
  readonly call?: Partial<ToolCall>;
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

const toolRig = async (options: RigOptions = {}): Promise<ToolRig> => {
  const base = rig();
  options.seed?.(base.disk);
  withManifest(base.disk, options.manifest);
  base.disk.picks.folder = ROOT;
  await openProject();
  const project = useProjectStore.getState().project;
  if (!project) throw new Error('the project did not open');
  const parts = { host: base.kit.host, paths: base.kit.paths, documents: base.disk.port };
  const runWith = async (tool: ToolName, input: unknown, { grants, mode = 'edit', settings, call }: RunSetup): Promise<ToolOutcome> => {
    const handler = TOOL_HANDLERS[tool];
    if (!handler) throw new Error(`no handler for ${tool}`);
    const outcome = (await handler(input, toolContext({ ...parts, call }, grants, mode, settings))).outcome;
    expectValid(tool, outcome);
    return outcome;
  };
  const run = (tool: ToolName, input: unknown, grants: readonly ProjectGrant[], mode: SessionMode = 'edit'): Promise<ToolOutcome> =>
    runWith(tool, input, { grants, mode });
  const { projectId } = project.manifest;
  const folderId = project.manifest.folders[0]?.folderId ?? '';
  return {
    rig: base,
    projectId,
    folderId,
    grants: (access = 'edit') => [grantOf(projectId, access)],
    locate: (path) => ({ projectId, folderId, path }),
    run,
    runWith,
  };
};

const fieldOf = (outcome: ToolOutcome, key: string): unknown => (outcome.ok ? outcome[key] : undefined);

const rowsOf = (outcome: ToolOutcome, key: string): readonly Record<string, unknown>[] => {
  const value = fieldOf(outcome, key);
  return Array.isArray(value) ? value.filter((row): row is Record<string, unknown> => typeof row === 'object' && row !== null) : [];
};

export { bxelBytes, fieldOf, grantOf, ROOT, rowsOf, toolRig };
export type { ToolRig };
