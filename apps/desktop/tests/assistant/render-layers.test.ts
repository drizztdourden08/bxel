/* @layer renderer-app @kind test */
import type { Sprite } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { layersOnly } from '../../src/assistant/tools/layers-only';
import { fieldOf } from '../project/project-tool-rig';
import { assistantTools } from './assistant-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const { current, make, spriteOf, handled } = assistantTools();

const layer = (id: string, visible: boolean, kind?: string, parentId?: string) => ({ id, visible, ...(kind ? { kind } : {}), ...(parentId ? { parentId } : {}) });

const sprite = {
  layers: [layer('a', true, undefined, 'g'), layer('b', true, undefined, 'g'), layer('g', false, 'group'), layer('c', true)],
} as unknown as Sprite;

const shown = (given: Sprite | null): string[] => (given?.layers ?? []).filter((each) => each.visible).map((each) => each.id);

describe('K1 layers only', { tags: ['critical'] }, () => {
  it('keeps the named layer and its groups, and hides everything else', () => {
    expect(shown(layersOnly(sprite, ['a']))).toEqual(['a', 'g']);
    expect(shown(layersOnly(sprite, ['c']))).toEqual(['c']);
  });

  it('shows a hidden layer that is named and every layer inside a named group', () => {
    expect(shown(layersOnly(sprite, ['g']))).toEqual(['a', 'b', 'g']);
  });

  it('refuses a layer that is not in the sprite', () => {
    expect(layersOnly(sprite, ['a', 'absent'])).toBeNull();
  });
});

describe('S2 render_preview layers', { tags: ['standard'] }, () => {
  it('draws a sprite through the named layers and names them in the resource', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(documentId);
    const first = current().rig.kit.host.view(documentId as never)?.state.artwork.sprites[0]?.layers[0]?.id ?? '';
    const preview = await handled('render_preview', { documentId, target: { spriteId }, scale: 1, layers: [first] });
    expect(preview.outcome).toMatchObject({ ok: true, scale: 1 });
    expect(preview.images).toHaveLength(1);
    expect(String(fieldOf(preview.outcome, 'uri'))).toContain(`&layers=${first}`);
  });

  it('does not find a layer that is not in the sprite', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(documentId);
    const preview = await handled('render_preview', { documentId, target: { spriteId }, scale: 1, layers: ['lay_zzzzzzzzzzzz'] });
    expect(preview.outcome).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
  });
});
