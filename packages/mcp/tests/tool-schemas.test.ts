/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, describeTools, parseToolInput, TOOL_MODE, TOOL_NAME } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { INPUT_EXAMPLES, OUTPUT_EXAMPLES } from './examples';

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
  it('has the 19 tools of the contract, each with a mode', () => {
    expect(tools).toHaveLength(19);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(19);
    expect(Object.values(TOOL_NAME).sort()).toEqual(tools.map((tool) => tool.name).sort());
    for (const tool of tools) expect(tool.mode).toBe(TOOL_MODE[tool.name]);
  });

  it('needs edit for exactly the five editing tools', () => {
    const editing = tools.filter((tool) => tool.mode === 'edit').map((tool) => tool.name);
    expect(editing.sort()).toEqual(['apply_edits', 'create_document', 'export_document', 'save_document', 'undo']);
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
