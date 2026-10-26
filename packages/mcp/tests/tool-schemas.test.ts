/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, describeTools, parseToolInput, TOOL_MODE, TOOL_NAME } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { ASSET_INPUT_EXAMPLES, ASSET_OUTPUT_EXAMPLES } from './asset-examples';
import { INPUT_EXAMPLES as BASE_INPUTS, OUTPUT_EXAMPLES as BASE_OUTPUTS } from './examples';

const INPUT_EXAMPLES = { ...BASE_INPUTS, ...ASSET_INPUT_EXAMPLES };
const OUTPUT_EXAMPLES = { ...BASE_OUTPUTS, ...ASSET_OUTPUT_EXAMPLES };

const tools = buildTools(documentCommands);
const descriptors = describeTools(documentCommands);

const refsOf = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(refsOf);
  if (typeof value !== 'object' || value === null) return [];
  return Object.entries(value).flatMap(([key, child]) =>
    key === '$ref' && typeof child === 'string' ? [child] : refsOf(child),
  );
};

describe('the tool set', () => {
  it('has the 24 tools of the contract, each with a mode', () => {
    expect(tools).toHaveLength(24);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(24);
    expect(Object.values(TOOL_NAME).sort()).toEqual(tools.map((tool) => tool.name).sort());
    for (const tool of tools) expect(tool.mode).toBe(TOOL_MODE[tool.name]);
  });

  it('needs edit for exactly the six editing tools', () => {
    const editing = tools.filter((tool) => tool.mode === 'edit').map((tool) => tool.name);
    expect(editing.sort()).toEqual(['apply_edits', 'create_document', 'export_document', 'save_document', 'split_legacy_file', 'undo']);
  });

  it('sets openWorldHint false on every tool', () => {
    for (const tool of tools) expect(tool.annotations.openWorldHint).toBe(false);
  });
});

describe('JSON Schema generation', () => {
  it.each(descriptors.map((descriptor) => [descriptor.name, descriptor] as const))(
    '%s compiles with object roots and resolvable references',
    (_name, descriptor) => {
      for (const schema of [descriptor.inputSchema, descriptor.outputSchema]) {
        expect(schema.type).toBe('object');
        const defs = Object.keys(schema.$defs ?? {});
        for (const ref of refsOf(schema)) expect(defs).toContain(ref.replace('#/$defs/', ''));
      }
    },
  );

  it('shares the contract definitions as $defs', () => {
    const apply = descriptors.find((descriptor) => descriptor.name === 'apply_edits');
    const defs = Object.keys(apply?.inputSchema.$defs ?? {});
    expect(defs).toEqual(expect.arrayContaining(['DocumentId', 'Revision', 'Rect', 'Indexes', 'TargetScope']));
    const failureDefs = Object.keys(apply?.outputSchema.$defs ?? {});
    expect(failureDefs).toEqual(expect.arrayContaining(['Failure', 'TargetIssue', 'ChangeSet']));
  });

  it('marks defaults optional on input and required on output', () => {
    const stop = descriptors.find((descriptor) => descriptor.name === 'stop_bxel');
    expect(stop?.inputSchema.required ?? []).not.toContain('unsaved');
    const files = descriptors.find((descriptor) => descriptor.name === 'list_files');
    expect(files?.inputSchema.required).toEqual(['projectId', 'folderId']);
  });

  it('puts the pixel patch on the wire as base64', () => {
    const apply = descriptors.find((descriptor) => descriptor.name === 'apply_edits');
    expect(JSON.stringify(apply?.inputSchema)).toContain('"contentEncoding":"base64"');
  });

  it('lists a branch for every registered command', () => {
    const apply = descriptors.find((descriptor) => descriptor.name === 'apply_edits');
    const text = JSON.stringify(apply?.inputSchema);
    for (const command of documentCommands) expect(text).toContain(`"const":"${command.name}"`);
  });
});

describe('round trips', () => {
  it.each(tools.map((tool) => [tool.name, tool] as const))('%s accepts a valid input and output example', (name, tool) => {
    const input = parseToolInput(tool, INPUT_EXAMPLES[name]);
    expect(input.ok).toBe(true);
    expect(tool.output.safeParse(OUTPUT_EXAMPLES[name]).success).toBe(true);
  });

  it('lists the optional tag colour of get_document as #rrggbb', () => {
    const tool = tools.find((candidate) => candidate.name === 'get_document');
    const example = OUTPUT_EXAMPLES.get_document as { sprites: { tags: object[] }[] };
    const withColour = (colour: unknown) => ({
      ...example,
      sprites: [{ ...example.sprites[0], tags: [{ name: 'walk', from: 0, to: 3, colour }] }],
    });
    expect(tool?.output.safeParse(withColour('#3b82f6')).success).toBe(true);
    expect(tool?.output.safeParse(withColour('blue')).success).toBe(false);
    expect(tool?.output.safeParse(withColour('#3b82f')).success).toBe(false);
    const descriptor = descriptors.find((candidate) => candidate.name === 'get_document');
    expect(JSON.stringify(descriptor?.outputSchema)).toContain('"colour"');
  });

  it('rejects an unknown property on a strict input', () => {
    const tool = tools.find((candidate) => candidate.name === 'get_session');
    expect(tool && parseToolInput(tool, { extra: 1 }).ok).toBe(false);
  });
});

describe('the asset tools', () => {
  const tool = (name: string) => {
    const found = tools.find((candidate) => candidate.name === name);
    if (!found) throw new Error(`no ${name}`);
    return found;
  };
  const parsed = (name: string, input: unknown): Record<string, unknown> => {
    const result = parseToolInput(tool(name), input);
    if (!result.ok) throw new Error('input refused');
    return result.value as Record<string, unknown>;
  };
  const PROJECT_ID = 'prj_8d2k4m6q9x1v';
  const DOCUMENT = 'doc_4k9m2q7x1v8c';

  it('list_assets asks for a project and defaults to every asset kind', () => {
    expect(parseToolInput(tool('list_assets'), {}).ok).toBe(false);
    expect(parsed('list_assets', { projectId: PROJECT_ID }).kinds).toEqual(['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap']);
    expect(parseToolInput(tool('list_assets'), { projectId: PROJECT_ID, kinds: ['image'] }).ok).toBe(false);
  });

  it('create_document defaults to a sprite and takes the other kinds', () => {
    const base = { name: 'Hero', bank: { name: 'Main', cap: 16, transparent: true, colors: [] } };
    expect(parsed('create_document', base).kind).toBe('sprite');
    expect(parseToolInput(tool('create_document'), { ...base, kind: 'tilemap', tileSize: { width: 8, height: 8 } }).ok).toBe(true);
    expect(parseToolInput(tool('create_document'), { ...base, kind: 'project' }).ok).toBe(false);
  });

  it('create_document makes an animation and render_preview and export_document name one', () => {
    const base = { name: 'Water', bank: { name: 'Main', cap: 16, transparent: true, colors: [] } };
    expect(parseToolInput(tool('create_document'), { ...base, kind: 'animation', animation: { width: 16, height: 16, frames: 4 } }).ok).toBe(true);
    const animation = 'anm_4k9m2q7x1v8c';
    expect(parseToolInput(tool('render_preview'), { documentId: DOCUMENT, target: { animationId: animation } }).ok).toBe(true);
    expect(parseToolInput(tool('render_preview'), { documentId: DOCUMENT, target: { animationId: animation, tagId: 'tag_4k9m2q7x1v8c' } }).ok).toBe(true);
    expect(parseToolInput(tool('render_preview'), { documentId: DOCUMENT, target: { animationId: animation, frameId: 'afr_4k9m2q7x1v8c', tagId: 'tag_4k9m2q7x1v8c' } }).ok).toBe(false);
    expect(parseToolInput(tool('export_document'), { documentId: DOCUMENT, format: 'gif', source: { animationId: animation }, fileName: 'water.gif' }).ok).toBe(true);
  });

  it('save_document keeps the asset where it is unless moveAsset is asked for', () => {
    const result = parsed('save_document', { documentId: DOCUMENT, target: { fileName: 'hero.bxsprite' } });
    expect((result.target as { moveAsset: boolean }).moveAsset).toBe(false);
    expect(parseToolInput(tool('save_document'), { documentId: DOCUMENT, asset: { kind: 'sheet', id: 'sht_1' }, target: 'current' }).ok).toBe(true);
  });

  it('names the new extensions in the descriptions', () => {
    const text = descriptors.map((descriptor) => descriptor.description).join(' ');
    for (const extension of ['.bxsprite', '.bxanim', '.bxsheet', '.bxpalette', '.bxtiles', '.bxmap']) expect(text).toContain(extension);
  });
});
