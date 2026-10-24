/* @layer core @kind types */
import type { FolderId, ProjectId } from '../ids/id.type';
import type { SwatchSet } from '../swatches/swatch.type';
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
  readonly swatchSets: readonly SwatchSet[];
  readonly assistant: { readonly access: AccessLevel };
};

type ManifestSeed = {
  readonly projectId: ProjectId;
  readonly folderId: FolderId;
  readonly name: string;
};

type ManifestIssue = {
  readonly path: (string | number)[];
  readonly message: string;
};

export type { AccessLevel, FolderLocation, ManifestIssue, ManifestSeed, ProjectFolder, ProjectManifest, ProjectSettings };
