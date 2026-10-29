/* @layer renderer-app @kind test */
import { encodeBrushPixels } from '@bxel/document';
import type { Artwork, DocumentId } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { openPath } from '../../src/workspace/open-path';
import { runSplit } from '../../src/workspace/run-split';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { savedManifest } from '../config/config-harness';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject } from './open-sample-project';
import { legacyBytes, sampleArtwork } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const PARENT = 'C:/Art';
const PIXELS = encodeBrushPixels(Uint8Array.from([1, 2, 0, 3]));

let held: Rig;

const workspaces = () => Object.values(useWorkspaceStore.getState().workspaces);

const addBrush = (documentId: DocumentId): void => {
  const view = useDocumentStore.getState().host.view(documentId);
  if (!view) throw new Error('no document');
  const result = useDocumentStore.getState().host.execute({
    documentId,
    baseRevision: view.state.revision,
    mode: 'commit',
    origin: 'ui',
    label: 'New brush',
    steps: [{ name: 'brush.add', targets: null, ref: 'b', options: { name: 'Dots', width: 2, height: 2, pixels: PIXELS } }],
    previewPixels: 0,
  });
  if (!result.ok) throw new Error('the brush was refused');
};

const brushNames = (artwork: Artwork): string[] => (artwork.brushes ?? []).map((brush) => brush.name);

beforeEach(() => {
  held = rig();
  held.disk.granted.add(PARENT.toLowerCase());
  held.disk.dirs.add(PARENT);
});

describe('a saved brush in a project', () => {
  it('marks the project file, writes it with the brush and returns when the project opens again', async () => {
    const { documentId } = await openSampleProject(held);
    addBrush(documentId);
    const artwork = artworkOf(documentId);
    expect([...(useWorkspaceStore.getState().workspaces[documentId]?.dirty ?? [])]).toEqual([`project:${artwork.id}`]);
    await saveWorkspace(held.kit, documentId);
    expect(savedManifest(held).brushes?.map((brush) => [brush.name, brush.width, brush.height, brush.pixels])).toEqual([['Dots', 2, 2, PIXELS]]);
    useWorkspaceStore.setState({ workspaces: {} });
    await openProject();
    const [reopened] = workspaces();
    if (!reopened) throw new Error('the project did not open again');
    expect(brushNames(artworkOf(reopened.documentId))).toEqual(['Dots']);
    expect(artworkOf(reopened.documentId).brushes?.[0]?.pixels).toBe(PIXELS);
  });
});

describe('a saved brush in an older single file', () => {
  it('goes with the file into the project when the file is split beside', async () => {
    const base = sampleArtwork();
    const brush = { id: 'brs_0a1b2c3d4e5f' as never, name: 'Dots', width: 2, height: 2, pixels: PIXELS };
    held.disk.files.set(`${PARENT}/old.bxel`, legacyBytes({ ...base, brushes: [brush] }));
    await openPath(held.kit, `${PARENT}/old.bxel`);
    const legacy = workspaces()[0];
    if (!legacy) throw new Error('no workspace');
    expect(brushNames(artworkOf(legacy.documentId))).toEqual(['Dots']);
    held.disk.picks.folder = PARENT;
    expect(await runSplit(legacy.documentId, 'beside')).toEqual({ kind: 'done' });
    const [project] = workspaces();
    expect(project?.kind).toBe('project');
    expect(brushNames(artworkOf(project?.documentId ?? ('' as DocumentId)))).toEqual(['Dots']);
  });
});
