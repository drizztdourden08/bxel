/* @layer renderer-app @kind types */
import type { AssetRow } from '../../asset-list/asset-list.type';
import type { OpenProject } from '../../project/project.type';
import type { DiskState, KnownProject } from '../../project-manager/project-manager.type';
import type { CreatableKind } from '../../stores/creation-store.type';
import type { AssetsModel } from '../ProjectPanel/sub-components/AssetsView/AssetsView.type';

type ManagerActions = {
  readonly newProject: () => void;
  readonly browseProject: () => void;
  readonly openProject: (project: KnownProject) => void;
  readonly closeProject: () => void;
  readonly removeFromList: (project: KnownProject) => void;
  readonly openConfig: (page: string) => void;
  readonly newAsset: (kind: CreatableKind) => void;
  readonly inAssetSettings: (row: AssetRow) => void;
  readonly toEdit: (row: AssetRow) => void;
  readonly renameProject: (name: string) => Promise<string | null>;
};

type ProjectManagerModel = {
  readonly known: readonly KnownProject[];
  readonly selected: KnownProject | null;
  readonly select: (key: string) => void;
  readonly open: OpenProject | null;
  readonly disk: DiskState;
  readonly assets: AssetsModel;
  readonly editable: boolean;
  readonly search: string;
  readonly setSearch: (search: string) => void;
  readonly choice: AssetRow | null;
  readonly choose: (row: AssetRow | null) => void;
  readonly actions: ManagerActions;
};

type ManagerPartProps = { readonly model: ProjectManagerModel };

type ManagerRowProps = ManagerPartProps & { readonly row: AssetRow };

type ProjectRowProps = ManagerPartProps & { readonly project: KnownProject };

type ProjectSelection = {
  readonly selected: KnownProject | null;
  readonly select: (key: string) => void;
};

type ProjectRename = {
  readonly renaming: boolean;
  readonly error: string | null;
  readonly start: () => void;
  readonly stop: () => void;
  readonly submit: (name: string) => void;
};

type HeaderProps = ProjectRowProps & { readonly rename: ProjectRename };

type ManagerAssets = {
  readonly assets: AssetsModel;
  readonly editable: boolean;
};

export type { HeaderProps, ManagerActions, ManagerAssets, ManagerPartProps, ManagerRowProps, ProjectManagerModel, ProjectRename, ProjectRowProps, ProjectSelection };
