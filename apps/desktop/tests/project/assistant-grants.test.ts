/* @layer renderer-app @kind test */
import type { ToolName } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { grantRig, layerEdit, pixelsRead, revisionOf, spriteId } from './grant-inputs';
import type { GrantRig } from './grant-inputs';
import { rowsOf } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let rig: GrantRig;

const READS: readonly ToolName[] = ['get_document', 'read_palette', 'read_pixels', 'render_preview', 'export_document'];

const WRITES: readonly ToolName[] = ['apply_edits', 'preview_edits', 'undo', 'save_document', 'close_document'];

const inputFor = (tool: ToolName): unknown => {
  const documentId = rig.documentId;
  const source = { spriteId: spriteId(rig, 0) };
  const inputs: Partial<Record<ToolName, unknown>> = {
    get_document: { documentId, spriteOffset: 0, spriteLimit: 10 },
    read_palette: { documentId },
    read_pixels: pixelsRead(rig, 0),
    render_preview: { documentId, target: source, scale: 1 },
    export_document: { documentId, format: 'png', source, fileName: 'x.png', scale: 1 },
    apply_edits: layerEdit(rig, 0),
    preview_edits: layerEdit(rig, 0),
    undo: { documentId, expectedRevision: revisionOf(rig) },
    save_document: { documentId, target: 'current' },
    close_document: { documentId, discard: true },
  };
  return inputs[tool];
};

beforeEach(async () => {
  rig = await grantRig();
});

describe('a project the owner has not granted to the assistant', () => {
  it('is left out of list_documents', async () => {
    const listed = await rig.current.run('list_documents', {}, []);
    expect(rowsOf(listed, 'documents')).toEqual([]);
    const granted = await rig.current.run('list_documents', {}, rig.current.grants('read'));
    expect(rowsOf(granted, 'documents')).toHaveLength(1);
  });

  it.each([...READS, ...WRITES])('answers %s as if the document did not exist', async (tool) => {
    const refused = await rig.current.run(tool, inputFor(tool), []);
    expect(refused).toMatchObject({ ok: false, error: { code: 'DOCUMENT_NOT_FOUND' } });
  });

  it('keeps the document unchanged', async () => {
    const before = revisionOf(rig);
    await rig.current.run('apply_edits', layerEdit(rig, 0), []);
    expect(revisionOf(rig)).toBe(before);
  });
});

describe('a project granted read only', () => {
  it.each(READS.filter((tool) => tool !== 'export_document'))('still answers %s', async (tool) => {
    expect(await rig.current.run(tool, inputFor(tool), rig.current.grants('read'))).toMatchObject({ ok: true });
  });

  it('refuses apply_edits and preview_edits and leaves the revision alone', async () => {
    const before = revisionOf(rig);
    for (const tool of ['apply_edits', 'preview_edits'] as const) {
      const refused = await rig.current.run(tool, layerEdit(rig, 0), rig.current.grants('read'));
      expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    }
    expect(revisionOf(rig)).toBe(before);
  });

  it('refuses undo of a change the assistant made while the project was editable', async () => {
    const made = await rig.current.run('apply_edits', layerEdit(rig, 0), rig.current.grants('edit'));
    expect(made).toMatchObject({ ok: true });
    const refused = await rig.current.run('undo', inputFor('undo'), rig.current.grants('read'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
  });

  it('refuses to discard the open changes of the owner', async () => {
    await rig.current.run('apply_edits', layerEdit(rig, 0), rig.current.grants('edit'));
    const refused = await rig.current.run('close_document', inputFor('close_document'), rig.current.grants('read'));
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
    expect(rig.current.rig.kit.host.view(rig.documentId as never)).not.toBeNull();
  });

  it('treats an edit grant under a read only session the same way', async () => {
    const refused = await rig.current.run('apply_edits', layerEdit(rig, 0), rig.current.grants('edit'), 'read');
    expect(refused).toMatchObject({ ok: false, error: { code: 'PROJECT_NOT_GRANTED' } });
  });

  it('lets an edit grant change the document', async () => {
    const allowed = await rig.current.run('apply_edits', layerEdit(rig, 0), rig.current.grants('edit'));
    expect(allowed).toMatchObject({ ok: true });
  });
});
