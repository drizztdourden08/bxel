/* @layer renderer-app @kind types */
import type { DiskState, KnownProject } from '../../project-manager/project-manager.type';

type ProjectListActions = {
  readonly newProject: () => void;
  readonly browseProject: () => void;
  readonly openProject: (project: KnownProject) => void;
  readonly closeProject: () => void;
  readonly removeFromList: (project: KnownProject) => void;
  readonly reveal: (project: KnownProject) => void;
};

type ProjectListModel = {
  readonly known: readonly KnownProject[];
  readonly selected: KnownProject | null;
  readonly select: (key: string) => void;
  readonly disk: DiskState;
  readonly actions: ProjectListActions;
};

type ProjectListPartProps = { readonly model: ProjectListModel };

type ProjectPartProps = ProjectListPartProps & { readonly project: KnownProject };

export type { ProjectListActions, ProjectListModel, ProjectListPartProps, ProjectPartProps };
