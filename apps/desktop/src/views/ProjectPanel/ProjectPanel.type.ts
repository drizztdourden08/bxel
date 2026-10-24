/* @layer renderer-app @kind types */
import type { ListedEntry, Listing, RecentProject } from '@bxel/project';
import type { OpenProject, ProjectFolderState } from '../../project/project.type';

type ProjectPanelModel = {
  readonly project: OpenProject | null;
  readonly recents: readonly RecentProject[];
  readonly folder: ProjectFolderState | null;
  readonly segments: readonly string[];
  readonly listing: Listing | null;
  readonly error: string | null;
  readonly naming: boolean;
  readonly nameError: string | null;
  readonly selected: string | null;
  readonly chooseFolder: (folderId: string) => void;
  readonly openEntry: (entry: ListedEntry) => void;
  readonly select: (name: string) => void;
  readonly up: () => void;
  readonly refresh: () => void;
  readonly startNaming: () => void;
  readonly stopNaming: () => void;
  readonly createFile: (name: string) => void;
  readonly grantFolder: () => void;
  readonly newProject: () => void;
  readonly openProject: () => void;
  readonly openRecent: (root: string) => void;
  readonly closeProject: () => void;
};

type PanelPartProps = { readonly model: ProjectPanelModel };

type ListingState = { readonly listing: Listing | null; readonly error: string | null };

type Located = {
  readonly folder: ProjectFolderState | null;
  readonly segments: readonly string[];
  readonly chooseFolder: (folderId: string) => void;
  readonly enter: (name: string) => void;
  readonly up: () => void;
};

type ProjectActionsInput = {
  readonly dir: string | null;
  readonly enter: (name: string) => void;
  readonly refresh: () => void;
};

type ProjectActions = {
  readonly naming: boolean;
  readonly nameError: string | null;
  readonly openEntry: (entry: ListedEntry) => void;
  readonly startNaming: () => void;
  readonly stopNaming: () => void;
  readonly createFile: (name: string) => void;
};

export type { ListingState, Located, PanelPartProps, ProjectActions, ProjectActionsInput, ProjectPanelModel };
