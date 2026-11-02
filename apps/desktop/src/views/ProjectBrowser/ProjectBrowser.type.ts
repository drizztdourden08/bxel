/* @layer renderer-app @kind types */
import type { CreatableKind } from '../../stores/creation-store.type';
import type { BrowserModel } from '../../project-browser/browser-model.type';
import type { OpenProject } from '../../project/project.type';
import type { DiskProject } from '../../project-manager/project-manager.type';
import type { ContextMenuPoint, MenuGroup, VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { ReactNode } from 'react';
import type { RgbaImage } from '@bxel/formats';
import type { OrganiseCollection } from '@bxel/project';
import type { PreviewLayer } from '../../asset-overview/asset-overview.type';
import type { BrowserEntry, FolderNode, SortKey, SourceItem } from '../../project-browser/project-browser.type';
import type { FolderDropPayload } from './behavior/useFolderDrop.type';

type BrowserActions = {
  readonly open: (entry: BrowserEntry) => void;
  readonly openAll: (entries: readonly BrowserEntry[]) => void;
  readonly openBackground: (entry: BrowserEntry) => void;
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
  readonly tag: (entries: readonly BrowserEntry[], typed: string) => void;
  readonly untag: (entries: readonly BrowserEntry[], tag: string) => void;
  readonly collect: (entries: readonly BrowserEntry[], collection: string, on: boolean) => void;
  readonly collectInNew: (entries: readonly BrowserEntry[], name: string) => void;
  readonly newCollection: (name: string) => void;
  readonly deleteCollection: (collection: string) => void;
  readonly saveFilter: (query: string) => void;
  readonly removeFilter: (id: string) => void;
  readonly moveInto: (ids: readonly string[], folder: string) => void;
  readonly moveTo: (entries: readonly BrowserEntry[]) => void;
  readonly cut: (entries: readonly BrowserEntry[]) => void;
  readonly copy: (entries: readonly BrowserEntry[]) => void;
  readonly paste: () => void;
  readonly undoMove: () => void;
  readonly dropFiles: (files: readonly File[], folder: string) => void;
  readonly importImage: () => void;
  readonly importAsSprite: (entry: BrowserEntry) => void;
  readonly importPalette: () => void;
  readonly importTiled: () => void;
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

type SourceSectionProps = { readonly title: string; readonly empty?: string | undefined; readonly children?: ReactNode };

type EntryProps = { readonly entry: BrowserEntry };

type ProjectBrowserProps = { readonly project: OpenProject | null; readonly disk: DiskProject | null };

type MenuInput = {
  readonly entry: BrowserEntry;
  readonly picked: readonly BrowserEntry[];
  readonly actions: BrowserActions;
  readonly editable: boolean;
  readonly collections: readonly OrganiseCollection[];
};

type EntryMenuProps = { readonly point: ContextMenuPoint | null; readonly groups: readonly MenuGroup[]; readonly label: string; readonly onClose: () => void };

type TileProps = EntryProps & { readonly cell: VirtualGridCellBind };

type Column = { readonly key: SortKey; readonly label: string; readonly className: string };

type Commands = Readonly<Record<string, () => void>>;

type BrowserActionState = { readonly actions: BrowserActions; readonly renaming: string | null; readonly renameError: string | null };

type OrganiseActions = Pick<BrowserActions, 'pin' | 'tag' | 'untag' | 'collect' | 'collectInNew' | 'newCollection' | 'deleteCollection' | 'saveFilter' | 'removeFilter'>;

type ImportActions = { readonly importImage: () => void; readonly importAsSprite: (entry: BrowserEntry) => void; readonly importPalette: () => void; readonly importTiled: () => void; readonly dropFiles: (files: readonly File[], folder: string) => void };

type RenameFlow = {
  readonly renaming: string | null;
  readonly renameError: string | null;
  readonly startRename: (id: string) => void;
  readonly cancelRename: () => void;
  readonly commitRename: (entry: BrowserEntry, typed: string) => void;
  readonly newFolder: () => void;
};

type RowProps = EntryProps & { readonly column?: boolean; readonly open?: boolean };

type RowCellTextProps = { readonly value: string; readonly suffix?: string };

type ThumbCanvasProps = { readonly image: RgbaImage; readonly label: string };

type SourceDrop = {
  readonly files?: boolean;
  readonly canDrop: (key: string) => boolean;
  readonly onDrop: (key: string, payload: FolderDropPayload) => void;
};

type SourceTreeProps = {
  readonly label: string;
  readonly root: FolderNode;
  readonly selectedKey: string | null;
  readonly expandToDepth?: number;
  readonly drop?: SourceDrop | undefined;
  readonly onSelect: (key: string) => void;
};

type SourceLabelProps = { readonly item: SourceItem; readonly drop: SourceDrop | undefined };

type FileMoveActions = Pick<BrowserActions, 'moveInto' | 'moveTo' | 'cut' | 'copy' | 'paste' | 'undoMove'>;

type ReferenceListProps = { readonly title: string; readonly names: readonly string[] };

type PreviewLayersProps = {
  readonly layers: readonly PreviewLayer[];
  readonly flipped: ReadonlySet<string>;
  readonly onToggle: (id: string) => void;
};

export type { PreviewLayersProps, ReferenceListProps, FileMoveActions, OrganiseActions, SourceDrop, SourceLabelProps, SourceSectionProps, SourceTreeProps, BrowserActionState, Commands, ImportActions, RenameFlow, RowCellTextProps, RowProps, ThumbCanvasProps, BrowserActions, BrowserContextValue, Column, EntryMenuProps, EntryProps, MenuInput, ProjectBrowserProps, TileProps };
