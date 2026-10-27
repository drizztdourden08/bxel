/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { recentIdOf } from '../../src/assistant/tools/recent-id-of';
import { fieldOf, rowsOf, toolRig } from '../project/project-tool-rig';
import type { ToolRig } from '../project/project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let current: ToolRig;

const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] };

beforeEach(async () => {
  current = await toolRig();
});

describe('recentIdOf', () => {
  it('gives one id to a path however its slashes and case are written', () => {
    expect(recentIdOf('C:\\Art\\Hero.bxsprite')).toBe(recentIdOf('c:/art/hero.bxsprite'));
    expect(recentIdOf('C:/Art/Hero.bxsprite')).not.toBe(recentIdOf('C:/Art/Other.bxsprite'));
  });
});

describe('the recent id of a document outside every project', () => {
  it('is the same in list_documents and list_places, and open_file takes it', async () => {
    const made = await current.run('create_document', { name: 'hero', kind: 'sprite', bank, sprite: { name: 'hero', width: 8, height: 8 } }, []);
    const documentId = String(fieldOf(made, 'documentId'));
    current.rig.kit.paths.remember(documentId as never, 'C:\\Art\\hero.bxsprite');
    const listed = await current.run('list_documents', {}, []);
    const place = rowsOf(listed, 'documents')[0]?.place as { recentId?: string } | undefined;
    expect(place?.recentId).toBe(recentIdOf('C:/Art/hero.bxsprite'));
    const opened = await current.run('open_file', { file: { recentId: String(place?.recentId) }, activate: false }, []);
    expect(opened).toMatchObject({ ok: true, documentId, alreadyOpen: true });
  });
});
