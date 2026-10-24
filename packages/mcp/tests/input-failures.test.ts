/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, parseToolInput } from '@bxel/mcp';
import type { ToolSpec } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { INPUT_EXAMPLES, SCOPE } from './examples';

const tools = buildTools(documentCommands);

const toolNamed = (name: string): ToolSpec => {
  const found = tools.find((tool) => tool.name === name);
  if (!found) throw new Error(`No tool ${name}`);
  return found;
};

const failureOf = (name: string, input: unknown) => {
  const result = parseToolInput(toolNamed(name), input);
  if (result.ok) throw new Error('Expected a failure');
  return result.error;
};

const edit = (steps: unknown) => ({ ...(INPUT_EXAMPLES.apply_edits as object), steps });

describe('invalid inputs', () => {
  it('names the JSON path of a bad field', () => {
    const error = failureOf('read_pixels', { ...(INPUT_EXAMPLES.read_pixels as object), rect: { x: 0, y: 0, width: 0, height: 2 } });
    expect(error.code).toBe('INVALID_OPTION');
    expect(error.path).toBe('rect.width');
    expect(error.retry).toBe('fix_input');
    expect(error.step).toBeNull();
  });

  it('names the step and the path inside a batch', () => {
    const error = failureOf('apply_edits', edit([{ name: 'pixels.patch', targets: SCOPE, options: { rect: { x: 0, y: 0, width: 0, height: 1 }, pixels: 'AA==' } }]));
    expect(error.path).toBe('steps.0.options.rect.width');
    expect(error.step).toBe(0);
  });

  it('reports an unregistered command as UNKNOWN_COMMAND', () => {
    const error = failureOf('apply_edits', edit([{ name: 'pixels.sparkle', targets: SCOPE, options: {} }]));
    expect(error.code).toBe('UNKNOWN_COMMAND');
    expect(error.path).toBe('steps.0.name');
  });

  it('reports too many steps as BATCH_TOO_LARGE', () => {
    const step = { name: 'layer.add', targets: SCOPE, options: {} };
    const error = failureOf('apply_edits', edit(Array.from({ length: 257 }, () => step)));
    expect(error.code).toBe('BATCH_TOO_LARGE');
    expect(error.path).toBe('steps');
  });

  it('rejects an empty batch', () => {
    expect(failureOf('apply_edits', edit([])).path).toBe('steps');
  });

  it('rejects a read area over the patch limit', () => {
    const error = failureOf('read_pixels', {
      ...(INPUT_EXAMPLES.read_pixels as object),
      rect: { x: 0, y: 0, width: 2048, height: 33 },
    });
    expect(error.path).toBe('rect');
  });

  it('rejects ids with the wrong prefix', () => {
    expect(failureOf('close_document', { documentId: 'spr_4k9m2q7x1v8c' }).path).toBe('documentId');
  });

  it('rejects an export that names both a location and a file name', () => {
    const both = { ...(INPUT_EXAMPLES.export_document as object), location: INPUT_EXAMPLES.open_file };
    expect(failureOf('export_document', both).code).toBe('INVALID_OPTION');
    expect(failureOf('export_document', { documentId: 'doc_4k9m2q7x1v8c', format: 'png', source: { spriteId: 'spr_4k9m2q7x1v8c' } }).code).toBe('INVALID_OPTION');
  });

  it('rejects file names that break the rule', () => {
    for (const fileName of ['..\\x.png', 'a/b.png', '.hidden.png', 'x.exe1234']) {
      const input = { documentId: 'doc_4k9m2q7x1v8c', target: { fileName } };
      expect(parseToolInput(toolNamed('save_document'), input).ok).toBe(false);
    }
  });

  it('rejects project paths that break the rule', () => {
    const base = { projectId: 'prj_8d2k4m6q9x1v', folderId: 'fld_7r2k9m4q' };
    for (const path of ['../x', 'a//b', '/abs', 'a\\b', 'c:/x', 'a/./b']) {
      expect(parseToolInput(toolNamed('list_files'), { ...base, path }).ok).toBe(false);
    }
  });
});
