/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { encodeAsset } from '../../src/workspace/encode-asset';
import { fieldOf, ROOT, toolRig } from '../project/project-tool-rig';
import type { ToolRig } from '../project/project-tool-rig';
import { sampleArtwork } from '../workspace/workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let current: ToolRig;

beforeEach(async () => {
  current = await toolRig();
});

describe('open_file on a palette whose stored name differs from its file name', () => {
  it('keeps the stored name', async () => {
    const artwork = sampleArtwork();
    const bank = artwork.banks[0];
    if (!bank) throw new Error('the sample has no bank');
    const named = { ...artwork, banks: artwork.banks.map((each) => (each.id === bank.id ? { ...each, name: 'TTPal' } : each)) };
    const path = `${ROOT}/tt-palette.bxpalette`;
    current.rig.disk.files.set(path, encodeAsset(named, { kind: 'palette', id: bank.id }, new Map([[bank.id, path]]), { preview: null, clock: () => 0 }));
    const location = current.locate('tt-palette.bxpalette');
    const opened = await current.run('open_file', { file: location, activate: false }, current.grants());
    expect(opened).toMatchObject({ ok: true, asset: { kind: 'palette', name: 'TTPal' } });
    const palette = await current.run('read_palette', { documentId: String(fieldOf(opened, 'documentId')) }, current.grants());
    expect(fieldOf(palette, 'name')).toBe('TTPal');
  });
});
