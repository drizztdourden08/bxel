/* @layer renderer-app @kind types */
import type { RecentProject } from '@bxel/project';
import type { MouseEvent } from 'react';
import type { RowKind } from '../../asset-list/asset-list.type';
import type { BrowserItem, FilterCounts, ViewDensity } from '../../panel-browser/project-browser.type';
import type { BrowserEdit, BrowserModel, BrowserRows, BrowserView, ProjectViewSettings, SearchModel, SelectionModel } from '../../panel-browser/browser-state.type';
import type { BrowserSource } from '../../project-browser/browser-model.type';
import type { OpenProject } from '../../project/project.type';
import type { CreatableKind } from '../../stores/creation-store.type';

type PanelParts = {
  readonly project: OpenProject | null;
  readonly source: BrowserSource;
  readonly data: BrowserModel;
  readonly view: BrowserView;
  readonly search: SearchModel;
  readonly browser: BrowserRows;
  readonly selection: SelectionModel;
  readonly edit: BrowserEdit;
};

type FilterChip = { readonly id: string; readonly label: string; readonly remove: () => void };

type ViewSetter = (change: Partial<ProjectViewSettings>) => void;

type PickMods = { readonly shift: boolean; readonly toggle: boolean; readonly detail: number };

type Point = { readonly x: number; readonly y: number };

type RowActions = {
  readonly pick: (item: BrowserItem, mods: PickMods) => void;
  readonly picked: (keys: ReadonlySet<string>) => void;
  readonly open: (item: BrowserItem) => void;
  readonly openBackground: (item: BrowserItem) => void;
  readonly toggle: (key: string) => void;
  readonly collapseAll: () => void;
  readonly newAsset: (kind: CreatableKind, parentKey?: string) => void;
  readonly newFolder: (parentKey?: string) => void;
  readonly newHere: string;
  readonly trash: () => void;
  readonly duplicate: () => void;
  readonly rename: () => void;
  readonly showMenu: (key: string, point: Point) => void;
  readonly focusSearch: () => void;
};

type PickActions = Pick<RowActions, 'pick' | 'picked' | 'open' | 'openBackground' | 'toggle' | 'collapseAll'>;

type CreateActions = Pick<RowActions, 'newAsset' | 'newFolder' | 'newHere'>;

type BulkActions = Pick<RowActions, 'trash' | 'duplicate' | 'rename' | 'showMenu' | 'focusSearch'>;

type DragActions = {
  readonly dropKey: string | null;
  readonly markDrop: (key: string, over: boolean) => void;
  readonly moveKeys: (keys: readonly string[], folderKey: string) => void;
  readonly canMoveInto: (keys: readonly string[], folderKey: string | null) => boolean;
};

type MiddleOpen = {
  readonly onMouseDown: (event: MouseEvent<HTMLElement>) => void;
  readonly onAuxClick: (event: MouseEvent<HTMLElement>) => void;
};

type StartActions = {
  readonly newProject: () => void;
  readonly openProject: () => void;
  readonly openRecent: (root: string) => void;
  readonly removeRecent: (entry: RecentProject) => void;
  readonly openDemo: () => void;
};

type ProjectActions = {
  readonly closeProject: () => void;
  readonly openSettings: () => void;
  readonly openHub: () => void;
  readonly pack: () => void;
  readonly refresh: () => void;
  readonly grantFolder: (rootKey: string) => void;
  readonly unlink: (rootKey: string) => void;
};

type ProjectPanelModel = StartActions &
  ProjectActions & {
    readonly project: OpenProject | null;
    readonly recents: readonly RecentProject[];
    readonly source: BrowserSource;
    readonly data: BrowserModel;
    readonly view: BrowserView;
    readonly search: SearchModel;
    readonly browser: BrowserRows;
    readonly selection: SelectionModel;
    readonly edit: BrowserEdit;
    readonly density: ViewDensity;
    readonly counts: FilterCounts;
    readonly roleKinds: ReadonlyMap<string, RowKind>;
    readonly rowActions: RowActions;
    readonly drag: DragActions;
    readonly setWidth: (width: number) => void;
  };

type PanelPartProps = { readonly model: ProjectPanelModel };

type AssistantMarkProps = { readonly item: BrowserItem };

export type {
  AssistantMarkProps,
  BulkActions,
  CreateActions,
  DragActions,
  FilterChip,
  MiddleOpen,
  PanelParts,
  PanelPartProps,
  PickActions,
  PickMods,
  ProjectPanelModel,
  ViewSetter,
};
