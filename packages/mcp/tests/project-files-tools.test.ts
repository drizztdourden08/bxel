/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, checkGrant, MCP_ERROR_CODE, parseToolInput, PRESETS, TOOL_CATALOGUE } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const PROJECT = 'prj_8d2k4m6q9x1v';
const FOLDER = 'fld_7r2k9m4q';
const PLACE = { folderId: FOLDER, path: 'sprites/hero.bxsprite' };

const tool = (name: ToolName) => {
  const found = buildTools(documentCommands).find((each) => each.name === name);
  if (!found) throw new Error(`no tool ${name}`);
  return found;
};

const WRITING: readonly [ToolName, unknown][] = [
  ['repair_links', { projectId: PROJECT, all: true }],
  ['organise', { projectId: PROJECT, op: 'pin', files: [PLACE] }],
  ['move_files', { projectId: PROJECT, files: [PLACE], into: { folderId: FOLDER } }],
  ['rename_file', { projectId: PROJECT, file: PLACE, name: 'knight' }],
  ['create_folder', { projectId: PROJECT, in: { folderId: FOLDER }, name: 'heroes' }],
  ['trash_files', { projectId: PROJECT, files: [PLACE] }],
  ['duplicate_file', { projectId: PROJECT, files: [PLACE] }],
  ['import_files', { projectId: PROJECT, sources: [PLACE] }],
];

const READING: readonly [ToolName, unknown][] = [
  ['find_references', { projectId: PROJECT, file: PLACE }],
  ['project_health', { projectId: PROJECT }],
];

describe('K2 the project files tools', { tags: ['critical'] }, () => {
  it('sit in the Project files bundle, the reading ones as read and the others as write', () => {
    for (const [name] of WRITING) expect(TOOL_CATALOGUE[name], name).toMatchObject({ bundle: 'project_files', kind: 'write' });
    for (const [name] of READING) expect(TOOL_CATALOGUE[name], name).toMatchObject({ bundle: 'project_files', kind: 'read' });
  });

  it('marks only the trash as destructive and the readers as read only', () => {
    expect(tool('trash_files').annotations.destructiveHint).toBe(true);
    for (const name of ['move_files', 'rename_file', 'organise', 'repair_links', 'create_folder', 'duplicate_file', 'import_files'] as const) expect(tool(name).annotations.destructiveHint, name).toBe(false);
    for (const [name] of READING) expect(tool(name).annotations.readOnlyHint, name).toBe(true);
  });

  it('refuses every write for a Read program with the level reason, and allows the reads', () => {
    const grant = PRESETS.read_only.grant;
    for (const [name, input] of WRITING) {
      const failure = checkGrant(name, input, grant, 'Tester');
      expect(failure?.error.code, name).toBe(MCP_ERROR_CODE.READ_LEVEL);
      expect(failure?.error.message, name).toContain('Project files');
    }
    for (const [name, input] of READING) expect(checkGrant(name, input, grant, 'Tester'), name).toBeNull();
  });

  it('leaves the changes off in the Edit documents preset and on in Full control, and turns them off with the group', () => {
    expect(PRESETS.edit_documents.grant.bundles.project_files).toBe('read');
    for (const [name, input] of WRITING) {
      expect(checkGrant(name, input, PRESETS.edit_documents.grant)?.error.code, name).toBe(MCP_ERROR_CODE.READ_LEVEL);
      expect(checkGrant(name, input, PRESETS.full_control.grant), name).toBeNull();
    }
    for (const [name, input] of READING) expect(checkGrant(name, input, PRESETS.edit_documents.grant), name).toBeNull();
    const off = { ...PRESETS.full_control.grant, bundles: { ...PRESETS.full_control.grant.bundles, project_files: 'disabled' as const } };
    for (const [name, input] of [...WRITING, ...READING]) expect(checkGrant(name, input, off)?.error.code, name).toBe(MCP_ERROR_CODE.TOOL_DISABLED);
  });

  it('lets one tool follow its own level over the group', () => {
    const grant = { ...PRESETS.full_control.grant, tools: { trash_files: 'read' as const } };
    expect(checkGrant('trash_files', WRITING[5]?.[1], grant)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
    expect(checkGrant('move_files', WRITING[2]?.[1], grant)).toBeNull();
    const one = { ...PRESETS.edit_documents.grant, tools: { rename_file: 'edit' as const } };
    expect(checkGrant('rename_file', WRITING[3]?.[1], one)).toBeNull();
    expect(checkGrant('move_files', WRITING[2]?.[1], one)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
  });
});

describe('K2 the project files inputs', { tags: ['critical'] }, () => {
  it('asks find_references for a file or an asset id, not both and not neither', () => {
    expect(parseToolInput(tool('find_references'), { projectId: PROJECT }).ok).toBe(false);
    expect(parseToolInput(tool('find_references'), { projectId: PROJECT, file: PLACE, assetId: 'spr_x' }).ok).toBe(false);
    expect(parseToolInput(tool('find_references'), { projectId: PROJECT, assetId: 'spr_4k9m2q7x1v8c' }).ok).toBe(true);
    const parsed = parseToolInput(tool('find_references'), { projectId: PROJECT, file: PLACE });
    expect(parsed.ok && (parsed.value as { direction: string }).direction).toBe('both');
  });

  it('asks repair_links for fixes or all, not both and not neither', () => {
    const fix = { file: PLACE, linkId: 'spr_4k9m2q7x1v8c', by: 'id' };
    expect(parseToolInput(tool('repair_links'), { projectId: PROJECT }).ok).toBe(false);
    expect(parseToolInput(tool('repair_links'), { projectId: PROJECT, fixes: [fix], all: true }).ok).toBe(false);
    expect(parseToolInput(tool('repair_links'), { projectId: PROJECT, fixes: [fix] }).ok).toBe(true);
    expect(parseToolInput(tool('repair_links'), { projectId: PROJECT, all: true }).ok).toBe(true);
    expect(parseToolInput(tool('repair_links'), { projectId: PROJECT, fixes: [{ ...fix, by: 'guess' }] }).ok).toBe(false);
  });

  it('keeps breakLinks off unless it is asked for, and refuses a path that climbs out', () => {
    const parsed = parseToolInput(tool('trash_files'), { projectId: PROJECT, files: [PLACE] });
    expect(parsed.ok && (parsed.value as { breakLinks: boolean }).breakLinks).toBe(false);
    expect(parseToolInput(tool('trash_files'), { projectId: PROJECT, files: [{ folderId: FOLDER, path: '../x.bxsprite' }] }).ok).toBe(false);
    expect(parseToolInput(tool('move_files'), { projectId: PROJECT, files: [], into: { folderId: FOLDER } }).ok).toBe(false);
  });

  it('knows the organise operations', () => {
    expect(parseToolInput(tool('organise'), { projectId: PROJECT, op: 'collect', collection: 'Players', files: [PLACE] }).ok).toBe(true);
    expect(parseToolInput(tool('organise'), { projectId: PROJECT, op: 'explode' }).ok).toBe(false);
  });

  it('asks duplicate_file and import_files for files, and takes into only on import_files', () => {
    expect(parseToolInput(tool('duplicate_file'), { projectId: PROJECT, files: [] }).ok).toBe(false);
    expect(parseToolInput(tool('duplicate_file'), { projectId: PROJECT, files: [PLACE] }).ok).toBe(true);
    expect(parseToolInput(tool('import_files'), { projectId: PROJECT, sources: [PLACE], into: { folderId: FOLDER, path: 'heroes' } }).ok).toBe(true);
    expect(parseToolInput(tool('import_files'), { projectId: PROJECT, sources: [] }).ok).toBe(false);
    expect(parseToolInput(tool('duplicate_file'), { projectId: PROJECT, files: [PLACE], into: { folderId: FOLDER } }).ok).toBe(false);
  });

  it('takes a query on list_assets', () => {
    expect(parseToolInput(tool('list_assets'), { projectId: PROJECT, query: 'kind:sprite tag:hero' }).ok).toBe(true);
    expect(parseToolInput(tool('list_assets'), { projectId: PROJECT, query: 'x'.repeat(301) }).ok).toBe(false);
  });
});
