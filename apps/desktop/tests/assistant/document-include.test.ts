/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { spriteSummary } from '../../src/assistant/tools/sprite-summary';
import { fieldOf, rowsOf } from '../project/project-tool-rig';
import { assistantTools, TOOLS, useAssistantRig } from './assistant-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const current = useAssistantRig();

const { make, spriteOf, handled, revisionOf } = assistantTools(current);

const read = (documentId: string, include?: readonly string[]) =>
  current().run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10, ...(include ? { include } : {}) }, []);

const edit = async (documentId: string, steps: readonly object[]) => {
  const done = await handled('apply_edits', { documentId, baseRevision: revisionOf(documentId), label: 'Setup', steps });
  expect(done.outcome).toMatchObject({ ok: true });
};

describe('get_document include', () => {
  it('takes the detail names and refuses any other', () => {
    const spec = TOOLS.find((tool) => tool.name === 'get_document');
    const input = { documentId: 'doc_aaaaaaaaaaaa', spriteOffset: 0, spriteLimit: 10 };
    expect(spec?.input.safeParse({ ...input, include: ['guides', 'slices', 'presets', 'tags', 'entries', 'tileset'] }).success).toBe(true);
    expect(spec?.input.safeParse({ ...input, include: ['everything'] }).success).toBe(false);
  });

  it('adds the id, direction and repeat of every sprite tag with tags, and only then', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const sprite = current().rig.kit.host.view(documentId as never)?.state.artwork.sprites[0];
    if (!sprite) throw new Error('no sprite');
    const frame = sprite.frames[0]?.id;
    const tag = { id: 'tag_aaaaaaaaaaaa', name: 'walk', from: frame, to: frame, direction: 'pingpong', repeat: 2 } as never;
    const tagged = { ...sprite, tags: [tag] };
    expect(spriteSummary(false)(tagged).tags).toEqual([{ name: 'walk', from: 0, to: 0 }]);
    expect(spriteSummary(true)(tagged).tags).toEqual([{ name: 'walk', from: 0, to: 0, tagId: 'tag_aaaaaaaaaaaa', direction: 'pingpong', repeat: 2 }]);
    expect(rowsOf(await read(documentId, ['tags']), 'sprites')[0]?.tags).toEqual([]);
  });

  it('adds the guide lines of tilemaps with guides, and only then', async () => {
    const { documentId, assetId } = await make('tilemap');
    await edit(documentId, [{ name: 'tilemap.guides', targets: null, options: { tilemap: assetId, guides: { x: [2], y: [3] } } }]);
    expect(rowsOf(await read(documentId), 'tilemaps')[0]).not.toHaveProperty('guides');
    expect(rowsOf(await read(documentId, ['guides']), 'tilemaps')[0]).toMatchObject({ guides: { x: [2], y: [3] } });
  });

  it('adds the export presets with presets, and only then', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    await edit(documentId, [{ name: 'preset.add', targets: null, options: { name: 'Web', owner: { project: true }, format: 'png', scale: 2 } }]);
    expect(fieldOf(await read(documentId), 'presets')).toBeUndefined();
    const presets = rowsOf(await read(documentId, ['presets']), 'presets');
    expect(presets).toHaveLength(1);
    expect(presets[0]).toMatchObject({ name: 'Web', format: 'png', scale: 2, sheetId: null });
    expect(String(presets[0]?.presetId)).toMatch(/^exp_/u);
  });
});
