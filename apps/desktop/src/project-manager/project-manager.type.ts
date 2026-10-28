/* @layer renderer-app @kind types */
import type { ProjectDocument, ProjectId, ResolvedFolder } from '@bxel/project';
import type { ListedFile } from '../asset-list/asset-list.type';

type KnownProject = {
  readonly key: string;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly rootRealPath: string;
  readonly open: boolean;
  readonly openedAt: string;
};

type KnownSource = Pick<KnownProject, 'projectId' | 'name' | 'rootRealPath' | 'openedAt'>;

type DiskProject = {
  readonly manifest: ProjectDocument;
  readonly projectFile: string;
  readonly folders: readonly ResolvedFolder[];
  readonly files: readonly ListedFile[];
  readonly previews: ReadonlyMap<string, string>;
};

type DiskManifest = {
  readonly root: string;
  readonly manifest: ProjectDocument;
  readonly projectFile: string;
  readonly folders: readonly ResolvedFolder[];
};

type DiskManifestResult = { readonly ok: true; readonly value: DiskManifest } | { readonly ok: false; readonly message: string };

type DiskOutcome = { readonly ok: true; readonly project: DiskProject } | { readonly ok: false; readonly message: string };

type DiskState =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'failed'; readonly message: string }
  | { readonly status: 'ready'; readonly project: DiskProject };

type ProjectFact = { readonly label: string; readonly value: string };

export type { DiskManifestResult, DiskOutcome, DiskProject, DiskState, KnownProject, KnownSource, ProjectFact };
