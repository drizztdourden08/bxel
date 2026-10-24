/* @layer core @kind types */
import type { ProjectDefaults } from '../defaults/asset-defaults.type';
import type { FolderId, ProjectId } from '../ids/id.type';
import type { MANIFEST_FORMAT } from '../manifest/manifest.constants';
import type { AccessLevel, ProjectFolder } from '../manifest/manifest.type';
import type { FOLDER_ROLES, PROJECT_DOCUMENT_VERSION } from './project-document.constants';

type FolderRole = (typeof FOLDER_ROLES)[number];

type FolderRoles = Partial<Record<FolderRole, string>>;

type DocumentFolder = ProjectFolder & { readonly roles: FolderRoles };

type AssistantScope = {
  readonly access: AccessLevel;
  readonly folders?: readonly FolderId[];
};

type ProjectCover = { readonly folderId: FolderId; readonly path: string };

type ProjectDocument = {
  readonly format: typeof MANIFEST_FORMAT;
  readonly formatVersion: typeof PROJECT_DOCUMENT_VERSION;
  readonly projectId: ProjectId;
  readonly name: string;
  readonly cover?: ProjectCover;
  readonly folders: readonly DocumentFolder[];
  readonly defaults: ProjectDefaults;
  readonly assistant: AssistantScope;
};

export type { AssistantScope, FolderRole, FolderRoles, DocumentFolder, ProjectCover, ProjectDocument };
