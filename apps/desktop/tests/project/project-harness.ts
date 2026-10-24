/* @layer renderer-app @kind test */
import { createFolderId, createManifest, createProjectId, manifestFileName, writeManifest } from '@bxel/project';
import type { ProjectGrant, ProjectManifest, RecentProject } from '@bxel/project';
import { storePathBook } from '../../src/files/store-path-book';
import type { FileKit } from '../../src/files/files.type';
import type { ProjectPort } from '../../src/project/project.type';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useFileStore } from '../../src/stores/useFileStore';
import { useProjectSetsStore } from '../../src/stores/useProjectSetsStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { memoryDisk } from './memory-disk';
import type { Disk } from './memory-disk';
import { confirmAction, held, toast } from './project-mocks';

const ROOT = 'C:/Art/Dungeon';

const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 5);

type Values = { projectRecents: readonly RecentProject[]; assistantProjects: readonly ProjectGrant[] };

type Rig = {
  readonly disk: Disk;
  readonly values: Values;
  readonly kit: FileKit;
};

const kitFor = (disk: Disk): FileKit => {
  const { host, setActive } = useDocumentStore.getState();
  return { documents: disk.port, host, paths: storePathBook(host), clock: () => 1_700_000_000_000, focus: setActive };
};

const resetStores = (): void => {
  useProjectStore.setState({ project: null, port: null, recents: [], dialog: false });
  useProjectSetsStore.getState().close();
  useFileStore.setState({ paths: {} });
  for (const documentId of useDocumentStore.getState().host.list()) useDocumentStore.getState().host.close(documentId);
};

const rig = (): Rig => {
  resetStores();
  const disk = memoryDisk();
  const values: Values = { projectRecents: [], assistantProjects: [] };
  const port = {
    read: (): ReturnType<ProjectPort['read']> => ({ projectRecents: values.projectRecents, assistantProjects: values.assistantProjects }),
    patch: (patch: Parameters<ProjectPort['patch']>[0]): void => {
      Object.assign(values, patch);
    },
  };
  useProjectStore.getState().setPort(port);
  const kit = kitFor(disk);
  held.documents = disk.port;
  toast.mockClear();
  confirmAction.mockClear();
  confirmAction.mockImplementation(() => Promise.resolve(true));
  return { disk, values, kit };
};

const manifestOf = (extra: Partial<ProjectManifest> = {}): ProjectManifest => ({
  ...createManifest({ projectId: createProjectId(bytes), folderId: createFolderId(bytes), name: 'Dungeon' }),
  ...extra,
});

const withManifest = (disk: Disk, manifest: ProjectManifest = manifestOf(), root = ROOT): string => {
  const text = writeManifest(manifest);
  if (!text.ok) throw new Error(text.message);
  const path = `${root}/${manifestFileName(manifest.name)}`;
  disk.files.set(path, text.value);
  disk.dirs.add(root);
  return path;
};

export { bytes, manifestOf, rig, ROOT, withManifest };
export type { Rig };
