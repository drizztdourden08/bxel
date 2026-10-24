/* @layer core @kind types */
import type { FolderId, ProjectId } from '../ids/id.type';
import type { ACCESS_SECTION_KEY } from './access-section.constants';
import type { ACCESS_LEVELS, MANIFEST_FORMAT, MANIFEST_VERSION } from './manifest.constants';

type AccessLevel = (typeof ACCESS_LEVELS)[number];

type ProjectFolder = {
  readonly folderId: FolderId;
  readonly name: string;
  readonly path: string;
};

type FolderLocation = {
  readonly folderId: FolderId;
  readonly path: string;
};

type ProjectSettings = {
  readonly newFiles: FolderLocation;
  readonly exports: FolderLocation;
  readonly palette: FolderLocation | null;
};

type ProjectManifest = {
  readonly format: typeof MANIFEST_FORMAT;
  readonly formatVersion: typeof MANIFEST_VERSION;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly folders: readonly ProjectFolder[];
  readonly settings: ProjectSettings;
  readonly [ACCESS_SECTION_KEY]: { readonly access: AccessLevel };
};

type ManifestIssue = {
  readonly path: (string | number)[];
  readonly message: string;
};

export type { AccessLevel,FolderLocation, ManifestIssue, ProjectFolder, ProjectManifest, ProjectSettings };
