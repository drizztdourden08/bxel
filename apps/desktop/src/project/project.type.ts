/* @layer renderer-app @kind types */
import type { AccessLevel, ProjectDocument, ProjectGrant, RecentProject, ResolvedFolder } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';

type ProjectFolderState = ResolvedFolder & { readonly granted: boolean };

type OpenProject = {
  readonly manifest: ProjectDocument;
  readonly rootRealPath: string;
  readonly projectFile: string;
  readonly preview: Uint8Array | null;
  readonly folders: readonly ProjectFolderState[];
};

type LoadedManifest = {
  readonly manifest: ProjectDocument;
  readonly projectFile: string;
  readonly preview: Uint8Array | null;
  readonly migrated: boolean;
};

interface ProjectSettings {
  projectRecents: readonly RecentProject[];
}

type ProjectValues = ProjectSettings & { readonly assistantProjects: readonly ProjectGrant[] };

type ProjectPort = {
  readonly read: () => ProjectValues;
  readonly patch: (patch: Partial<ProjectValues>) => void;
};

type ProjectOutcome = { readonly ok: true } | { readonly ok: false; readonly message: string };

type AccessTarget = Pick<RecentProject, 'projectId' | 'rootRealPath'>;

type ProjectTask = (documents: DocumentsPort) => Promise<ProjectOutcome | null>;

type ProjectLocation = {
  readonly folderId: string;
  readonly segments: readonly string[];
};

type LinkedFolder = {
  readonly manifest: ProjectDocument;
  readonly folder: ResolvedFolder;
};

type ProjectIdentity = Pick<OpenProject, 'manifest' | 'rootRealPath'>;

type EntryRef = {
  readonly dir: string;
  readonly name: string;
  readonly kind: 'file' | 'folder';
};

type GrantRow = {
  readonly projectId: RecentProject['projectId'];
  readonly name: string;
  readonly rootRealPath: string;
  readonly access: AccessLevel;
  readonly open: boolean;
  readonly folders: readonly string[];
};

export type {
  AccessTarget,
  EntryRef,
  GrantRow,
  LinkedFolder,
  LoadedManifest,
  OpenProject,
  ProjectFolderState,
  ProjectIdentity,
  ProjectLocation,
  ProjectOutcome,
  ProjectPort,
  ProjectSettings,
  ProjectTask,
};
