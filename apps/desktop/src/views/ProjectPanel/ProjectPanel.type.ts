/* @layer renderer-app @kind types */
import type { ListedEntry, Listing, RecentProject } from '@bxel/project';
import type { OpenProject, ProjectFolderState } from '../../project/project.type';

type ProjectPanelModel = EntryActions &
  ProjectActions & {
    readonly project: OpenProject | null;
    readonly recents: readonly RecentProject[];
    readonly folder: ProjectFolderState | null;
    readonly segments: readonly string[];
    readonly listing: Listing | null;
    readonly error: string | null;
    readonly selected: string | null;
    readonly chooseFolder: (folderId: string) => void;
    readonly select: (name: string) => void;
    readonly up: () => void;
    readonly refresh: () => void;
    readonly grantFolder: () => void;
    readonly newProject: () => void;
    readonly openProject: () => void;
    readonly openRecent: (root: string) => void;
    readonly closeProject: () => void;
    readonly removeRecent: (entry: RecentProject) => void;
    readonly openSettings: () => void;
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

type EntryActions = {
  readonly renaming: string | null;
  readonly renameError: string | null;
  readonly makingFolder: boolean;
  readonly folderError: string | null;
  readonly startRename: (entry: ListedEntry) => void;
  readonly stopRename: () => void;
  readonly rename: (name: string) => void;
  readonly trash: (entry: ListedEntry) => void;
  readonly startFolder: () => void;
  readonly stopFolder: () => void;
  readonly createFolder: (name: string) => void;
};

type FolderScope = {
  readonly dir: string | null;
  readonly refresh: () => void;
};

type RenameState = Pick<EntryActions, 'renaming' | 'renameError' | 'startRename' | 'stopRename' | 'rename'>;

type FolderMakerState = Pick<EntryActions, 'makingFolder' | 'folderError' | 'startFolder' | 'stopFolder' | 'createFolder'>;

type EntryRowProps = PanelPartProps & { readonly entry: ListedEntry };

export type { EntryActions, EntryRowProps, FolderScope, ListingState, Located, FolderMakerState, PanelPartProps, ProjectActions, ProjectActionsInput, ProjectPanelModel, RenameState };
