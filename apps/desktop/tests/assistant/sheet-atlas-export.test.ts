/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { assistantTools, FOLDER, useAssistantRig } from './assistant-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const current = useAssistantRig();

const { make, spriteOf, handled } = assistantTools(current);

const exportJob = (documentId: string, format: string, source: object, fileName: string) => ({
  documentId,
  format,
  source,
  scale: 1,
  overwrite: false,
  fileName,
});

describe('export_document of a sheet as atlas-json', () => {
  it('writes the JSON atlas under a .json name, and it names the png of the same stem', async () => {
    const { documentId, assetId } = await make('sheet');
    const source = { sheetId: assetId };
    const done = await handled('export_document', exportJob(documentId, 'atlas-json', source, 'tt-atlas.json'), { target: `${FOLDER}/tt-atlas.json` });
    expect(done.outcome).toMatchObject({ ok: true, files: [{ fileName: 'tt-atlas.json' }] });
    const text = new TextDecoder().decode(current().rig.disk.files.get(`${FOLDER}/tt-atlas.json`) as Uint8Array);
    expect(JSON.parse(text)).toMatchObject({ image: 'tt-atlas.png' });
    const image = await handled('export_document', exportJob(documentId, 'png', source, 'tt-atlas.png'), { target: `${FOLDER}/tt-atlas.png` });
    expect(image.outcome).toMatchObject({ ok: true });
  });

  it('refuses atlas-json for a sprite, with a clear error', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const source = { spriteId: await spriteOf(documentId) };
    const refused = await handled('export_document', exportJob(documentId, 'atlas-json', source, 'tt.json'), { target: `${FOLDER}/tt.json` });
    expect(refused.outcome).toMatchObject({ ok: false, error: { code: 'INVALID_OPTION' } });
  });

  it('does not find a sheet that is not in the document', async () => {
    const { documentId } = await make('sheet');
    const source = { sheetId: 'sht_zzzzzzzzzzzz' };
    const refused = await handled('export_document', exportJob(documentId, 'atlas-json', source, 'tt.json'), { target: `${FOLDER}/tt.json` });
    expect(refused.outcome).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
  });
});
