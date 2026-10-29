/* @layer renderer-app @kind types */
import type { OpenProject } from '../../project/project.type';
import type { GrantedProject } from '../assistant.type';

type FilePlace = { readonly folderId: string; readonly path: string };

type FolderPlace = { readonly folderId: string; readonly path?: string };

type FindReferencesInput = {
  readonly projectId: string;
  readonly file?: FilePlace;
  readonly assetId?: string;
  readonly direction: 'usedBy' | 'uses' | 'both';
};

type ProjectHealthInput = { readonly projectId: string; readonly checks?: readonly string[] };

type RepairLinksInput = {
  readonly projectId: string;
  readonly fixes?: readonly { readonly file: FilePlace; readonly linkId: string; readonly by: 'id' | 'path' | 'remove'; readonly to?: FilePlace }[];
  readonly all?: boolean;
};

type OrganiseInput = {
  readonly projectId: string;
  readonly op: string;
  readonly files?: readonly FilePlace[];
  readonly assets?: readonly string[];
  readonly tags?: readonly string[];
  readonly collection?: string;
  readonly name?: string;
  readonly query?: string;
  readonly search?: string;
};

type MoveFilesInput = { readonly projectId: string; readonly files: readonly FilePlace[]; readonly into: FolderPlace };

type RenameFileInput = { readonly projectId: string; readonly file: FilePlace; readonly name: string };

type CreateFolderInput = { readonly projectId: string; readonly in: FolderPlace; readonly name: string };

type TrashFilesInput = { readonly projectId: string; readonly files: readonly FilePlace[]; readonly breakLinks: boolean };

type VisibleProject = { readonly found: GrantedProject; readonly visible: OpenProject };

export type {
  CreateFolderInput,
  FilePlace,
  FindReferencesInput,
  FolderPlace,
  MoveFilesInput,
  OrganiseInput,
  ProjectHealthInput,
  RenameFileInput,
  RepairLinksInput,
  TrashFilesInput,
  VisibleProject,
};
