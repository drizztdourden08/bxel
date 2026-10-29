/* @layer renderer-app @kind test */
import { buildTools, parseToolInput } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';
import { beforeEach, expect } from 'vitest';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';
import { toolContext } from '../project/tool-context';
import { fieldOf, rowsOf, toolRig } from '../project/project-tool-rig';
import type { ToolRig } from '../project/project-tool-rig';

const FOLDER = 'C:/Assistant';

const BANK = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }, { rgb: '#00ff00' }] };

const TOOLS = buildTools(APP_COMMANDS);

type Made = { readonly documentId: string; readonly assetId: string };

const rigForTests = (): (() => ToolRig) => {
  const held: { rig?: ToolRig } = {};
  beforeEach(async () => {
    held.rig = await toolRig();
    held.rig.rig.disk.granted.add(FOLDER.toLowerCase());
  });
  return () => {
    if (!held.rig) throw new Error('the rig did not start');
    return held.rig;
  };
};

const assistantTools = () => {
  const current = rigForTests();
  const make = async (kind: string, extra: object = {}): Promise<Made> => {
    const made = await current().run('create_document', { name: `tt ${kind}`, kind, bank: BANK, ...extra }, []);
    expect(made).toMatchObject({ ok: true });
    return { documentId: String(fieldOf(made, 'documentId')), assetId: String((fieldOf(made, 'asset') as { id: string }).id) };
  };

  const spriteOf = async (documentId: string): Promise<string> => {
    const doc = await current().run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10 }, []);
    return String(rowsOf(doc, 'sprites')[0]?.spriteId);
  };

  const handled = async (name: ToolName, raw: unknown, call: object = {}) => {
    const handler = TOOL_HANDLERS[name];
    const spec = TOOLS.find((tool) => tool.name === name);
    if (!handler || !spec) throw new Error(`no tool ${name}`);
    const parsed = parseToolInput(spec, raw);
    if (!parsed.ok) throw new Error(`${parsed.error.code}: ${parsed.error.message}`);
    const rig = current().rig;
    const context = toolContext({ host: rig.kit.host, paths: rig.kit.paths, documents: rig.disk.port, call: { folder: FOLDER, ...call } });
    return handler(parsed.value, context);
  };

  const revisionOf = (documentId: string): number => current().rig.kit.host.view(documentId as never)?.state.revision ?? 1;

  return { current, make, spriteOf, handled, revisionOf };
};

export { assistantTools, FOLDER, TOOLS };
