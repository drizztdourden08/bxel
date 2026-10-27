/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardHandler } from '../../src/assistant/guard-handler';
import { savedDependencies } from '../../src/assistant/tools/saved-dependencies';
import { guardDocuments } from '../../src/prompts/guard-documents';
import { PromptRefused } from '../../src/prompts/prompt-refused';
import { refusingPrompts } from '../../src/prompts/refusing-prompts';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { toolContext } from '../project/tool-context';
import { confirmAction, confirmSave } from '../project/project-mocks';
import { fieldOf, toolRig } from '../project/project-tool-rig';
import type { ToolRig } from '../project/project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const FOLDER = 'C:/Assistant';

let current: ToolRig;
let dialogs: ReturnType<typeof vi.fn>;

const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }] };

const make = async (kind: string): Promise<string> => {
  const made = await current.run('create_document', { name: `tt ${kind}`, kind, bank }, []);
  expect(made).toMatchObject({ ok: true });
  return String(fieldOf(made, 'documentId'));
};

const saveInto = (documentId: string, name: string) =>
  current.runWith('save_document', { documentId, target: { fileName: name, overwrite: false, moveAsset: false } }, { grants: [], call: { target: `${FOLDER}/${name}`, folder: FOLDER } });

const names = (): string[] => [...current.rig.disk.files.keys()].filter((path) => path.startsWith(`${FOLDER}/`)).map((path) => path.slice(FOLDER.length + 1)).sort();

beforeEach(async () => {
  current = await toolRig();
  current.rig.disk.granted.add(FOLDER.toLowerCase());
  dialogs = vi.fn(() => Promise.resolve(null));
  Object.assign(current.rig.disk.port, { saveAs: dialogs, open: dialogs, openFolder: dialogs });
  confirmAction.mockClear();
  confirmSave.mockClear();
});

describe('save_document in the assistant folder', () => {
  it('saves a sheet and the sprite it holds, with no dialog', async () => {
    const id = await make('sheet');
    const saved = await saveInto(id, 'tt-sheet.bxsheet');
    expect(saved).toMatchObject({ ok: true, fileName: 'tt-sheet.bxsheet' });
    expect(fieldOf(saved, 'alsoSaved')).toMatchObject([{ asset: { kind: 'sprite' } }]);
    expect(names()).toEqual(expect.arrayContaining(['tt-sheet.bxsheet']));
    expect(names().some((name) => name.endsWith('.bxsprite'))).toBe(true);
    expect(dialogs).not.toHaveBeenCalled();
    expect(confirmAction).not.toHaveBeenCalled();
  });

  it('saves a tilemap and its tileset, with no dialog', async () => {
    const id = await make('tilemap');
    const saved = await saveInto(id, 'tt-tilemap.bxmap');
    expect(saved).toMatchObject({ ok: true, fileName: 'tt-tilemap.bxmap' });
    expect(names().some((name) => name.endsWith('.bxtiles'))).toBe(true);
    expect(dialogs).not.toHaveBeenCalled();
    expect(confirmAction).not.toHaveBeenCalled();
  });

  it('answers two parallel saves one after the other, with no dialog', async () => {
    const sheet = await make('sheet');
    const map = await make('tilemap');
    const both = await Promise.all([saveInto(sheet, 'tt-sheet.bxsheet'), saveInto(map, 'tt-tilemap.bxmap')]);
    expect(both).toMatchObject([{ ok: true }, { ok: true }]);
    expect(names()).toEqual(expect.arrayContaining(['tt-sheet.bxsheet', 'tt-tilemap.bxmap']));
    expect(dialogs).not.toHaveBeenCalled();
  });

  it('does not overwrite a file the dependency would have landed on', async () => {
    current.rig.disk.files.set(`${FOLDER}/tt sheet.bxsprite`, new Uint8Array([1, 2, 3]));
    const id = await make('sheet');
    const saved = await saveInto(id, 'tt-sheet.bxsheet');
    expect(saved).toMatchObject({ ok: true });
    expect(current.rig.disk.files.get(`${FOLDER}/tt sheet.bxsprite`)).toEqual(new Uint8Array([1, 2, 3]));
  });
});

describe('a dependency that cannot be given a file', () => {
  it('fails with DEPENDENCY_UNSAVED and lists the assets, and writes nothing', async () => {
    const id = await make('sheet');
    const context = toolContext(
      { host: current.rig.kit.host, paths: current.rig.kit.paths, documents: current.rig.disk.port },
      [],
      'edit',
      { assistantWrite: 'projects_and_assistant_folder' },
      { folder: FOLDER },
    );
    const artwork = context.host.view(id as never)?.state.artwork;
    const sheet = artwork?.sheets[0];
    const result = await savedDependencies(context, id as never, { keys: [{ kind: 'sheet', id: sheet?.id ?? '' }] }, 'C:/Elsewhere');
    expect('outcome' in result ? result.outcome : null).toMatchObject({ ok: false, error: { code: 'DEPENDENCY_UNSAVED' } });
    expect(current.rig.disk.writes).toEqual([]);
    expect(useWorkspaceStore.getState().workspaces[id as never]?.paths.size).toBe(0);
  });
});

describe('the dialog guard', () => {
  it('turns a refused dialog into NEEDS_OWNER instead of opening it', async () => {
    const handler = guardHandler(() => refusingPrompts().saveAs({ grantFolder: 'ask' }).then(() => ({ outcome: { ok: true as const }, images: [] })));
    const context = toolContext({ host: current.rig.kit.host, paths: current.rig.kit.paths, documents: current.rig.disk.port });
    const outcome = (await handler({}, context)).outcome;
    expect(outcome).toMatchObject({ ok: false, error: { code: 'NEEDS_OWNER', retry: 'after_owner' } });
  });

  it('refuses every dialog method of the documents port', async () => {
    const guarded = guardDocuments(current.rig.disk.port);
    await expect(guarded.saveAs()).rejects.toBeInstanceOf(PromptRefused);
    await expect(guarded.open()).rejects.toBeInstanceOf(PromptRefused);
    await expect(guarded.openFolder()).rejects.toBeInstanceOf(PromptRefused);
    await expect(guarded.regrant('C:/x')).rejects.toBeInstanceOf(PromptRefused);
    await expect(guarded.list(FOLDER)).resolves.toBeDefined();
    expect(dialogs).not.toHaveBeenCalled();
  });

  it('refuses a confirm and a save prompt too', async () => {
    await expect(refusingPrompts().confirm({ title: 'x', message: 'y' })).rejects.toBeInstanceOf(PromptRefused);
  });
});

describe('open_file', () => {
  it('refuses a project file, which would switch the owner project and may ask', async () => {
    const opened = await current.run('open_file', { file: current.locate('Dungeon.bxproject'), activate: false }, current.grants());
    expect(opened).toMatchObject({ ok: false, error: { code: 'FILE_NOT_SUPPORTED' } });
    expect(dialogs).not.toHaveBeenCalled();
    expect(confirmAction).not.toHaveBeenCalled();
    expect(confirmSave).not.toHaveBeenCalled();
  });
});
