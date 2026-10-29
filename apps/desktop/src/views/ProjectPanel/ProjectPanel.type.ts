/* @layer renderer-app @kind types */
import type { RecentProject } from '@bxel/project';
import type { DragEvent } from 'react';
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

type PickActions = Pick<RowActions, 'pick' | 'picked' | 'open' | 'toggle' | 'collapseAll'>;

type CreateActions = Pick<RowActions, 'newAsset' | 'newFolder' | 'newHere'>;

type BulkActions = Pick<RowActions, 'trash' | 'duplicate' | 'rename' | 'showMenu' | 'focusSearch'>;

type DragActions = {
  readonly dropKey: string | null;
  readonly dropOn: (target: BrowserItem | null) => Record<string, unknown>;
  readonly moveKeys: (keys: readonly string[], folderKey: string) => void;
  readonly canMoveInto: (keys: readonly string[], folderKey: string | null) => boolean;
};

type DropEvent = DragEvent<HTMLElement>;

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

export type {
  BulkActions,
  CreateActions,
  DragActions,
  DropEvent,
  FilterChip,
  PanelParts,
  PanelPartProps,
  PickActions,
  PickMods,
  ProjectPanelModel,
  ViewSetter,
};
