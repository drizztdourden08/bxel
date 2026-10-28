/* @layer renderer-app @kind types */
import type { CreatableKind } from '../../stores/creation-store.type';
import type { BrowserModel } from '../../project-browser/browser-model.type';
import type { OpenProject } from '../../project/project.type';
import type { DiskProject } from '../../project-manager/project-manager.type';
import type { ContextMenuPoint, MenuGroup, VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { DragEvent } from 'react';
import type { RgbaImage } from '@bxel/formats';
import type { BrowserEntry, SavedFilter, SortKey } from '../../project-browser/project-browser.type';

type BrowserActions = {
  readonly open: (entry: BrowserEntry) => void;
  readonly openAll: (entries: readonly BrowserEntry[]) => void;
  readonly properties: (entries: readonly BrowserEntry[]) => void;
  readonly startRename: (id: string) => void;
  readonly commitRename: (entry: BrowserEntry, typed: string) => void;
  readonly cancelRename: () => void;
  readonly newFolder: () => void;
  readonly newAsset: (kind: CreatableKind) => void;
  readonly trash: (entries: readonly BrowserEntry[]) => void;
  readonly duplicate: (entries: readonly BrowserEntry[]) => void;
  readonly reveal: (entry: BrowserEntry) => void;
  readonly copyPath: (entry: BrowserEntry) => void;
  readonly pin: (entries: readonly BrowserEntry[], on: boolean) => void;
  readonly moveInto: (ids: readonly string[], folder: string) => void;
  readonly importImage: () => void;
  readonly importPalette: () => void;
  readonly filterBy: (token: string) => void;
};

type BrowserContextValue = {
  readonly model: BrowserModel;
  readonly actions: BrowserActions;
  readonly selection: readonly string[];
  readonly renaming: string | null;
  readonly renameError: string | null;
  readonly thumb: number;
};

type EntryProps = { readonly entry: BrowserEntry };

type ProjectBrowserProps = { readonly project: OpenProject | null; readonly disk: DiskProject | null };

type DragItem = { readonly id: string; readonly kind: string; readonly assetId: string | null; readonly path: string };

type MenuInput = {
  readonly entry: BrowserEntry;
  readonly picked: readonly BrowserEntry[];
  readonly actions: BrowserActions;
  readonly editable: boolean;
};

type FolderDrop = {
  readonly over: boolean;
  readonly handlers: {
    readonly onDragOver: (event: DragEvent) => void;
    readonly onDragLeave: () => void;
    readonly onDrop: (event: DragEvent) => void;
  };
};

type EntryMenuProps = { readonly point: ContextMenuPoint | null; readonly groups: readonly MenuGroup[]; readonly label: string; readonly onClose: () => void };

type TileProps = EntryProps & { readonly cell: VirtualGridCellBind };

type Column = { readonly key: SortKey; readonly label: string; readonly className: string };

type Commands = Readonly<Record<string, () => void>>;

type BrowserActionState = { readonly actions: BrowserActions; readonly renaming: string | null; readonly renameError: string | null };

type ImportActions = { readonly importImage: () => void; readonly importPalette: () => void };

type RenameFlow = {
  readonly renaming: string | null;
  readonly renameError: string | null;
  readonly startRename: (id: string) => void;
  readonly cancelRename: () => void;
  readonly commitRename: (entry: BrowserEntry, typed: string) => void;
  readonly newFolder: () => void;
};

type ColumnItemProps = EntryProps & { readonly open: boolean };

type FilterRowProps = { readonly filter: SavedFilter; readonly count: number; readonly removable: boolean };

type RowCellTextProps = { readonly value: string; readonly suffix?: string };

type ThumbCanvasProps = { readonly image: RgbaImage; readonly label: string };

export type { BrowserActionState, ColumnItemProps, Commands, FilterRowProps, ImportActions, RenameFlow, RowCellTextProps, ThumbCanvasProps, BrowserActions, BrowserContextValue, Column, DragItem, EntryMenuProps, EntryProps, FolderDrop, MenuInput, ProjectBrowserProps, TileProps };
