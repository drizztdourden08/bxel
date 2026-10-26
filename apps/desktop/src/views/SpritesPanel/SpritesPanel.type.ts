/* @layer renderer-app @kind types */
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent, PointerEvent, ReactNode, RefObject } from 'react';
import type { MenuGroup, VirtualGridCellBind, VirtualSize } from '@drizztdourden08/tessera';
import type { Artwork, Rect, Sheet, Sprite, SpriteId } from '@bxel/document';
import type { PickHow, SpriteScene } from '../../sheet/sheet.type';
import type { FolderGroup, ListItem, SavedSelection } from '../../sheet-manager/folders.type';
import type { ManagerDialog, ManagerFilter, SortKey, SpriteFacts } from '../../sheet-manager/manager.type';
import type { HintSpec } from '../ActionHint';

interface ManagerModel {
  artwork: Artwork;
  scene: SpriteScene;
  sheet: Sheet | null;
  facts: readonly SpriteFacts[];
  shown: readonly SpriteFacts[];
  groups: readonly FolderGroup[];
  order: readonly SpriteId[];
  sizes: readonly string[];
  tags: readonly string[];
  twins: ReadonlySet<SpriteId>;
  ids: readonly SpriteId[];
}

interface ManagerModelProps {
  model: ManagerModel;
}

interface SpriteRenameProps {
  spriteName: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}

interface SpriteRenameState {
  renamingId: SpriteId | null;
  begin: (spriteId: SpriteId) => void;
  finish: () => void;
}

interface SpriteThumbProps {
  artwork: Artwork;
  sprite: Sprite;
  box: number;
}

interface SpriteDragHandlers {
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

interface SpriteState {
  selected: boolean;
  active: boolean;
  affected: boolean;
  loose: boolean;
  twin: boolean;
}

interface SpriteHandlers {
  onPick: (how: PickHow) => void;
  onRename: () => void;
  onMenu: () => void;
}

interface SpriteEvents {
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onDoubleClick: () => void;
  onContextMenu: () => void;
}

interface SpriteItemProps {
  fact: SpriteFacts;
  artwork: Artwork;
  state: SpriteState;
  drag: SpriteDragHandlers;
  handlers: SpriteHandlers;
}

interface RowPlace {
  style: CSSProperties;
  'aria-rowindex': number;
  'data-row-index': number;
}

interface SpriteRowProps extends SpriteItemProps {
  place?: RowPlace;
}

interface SpriteRowsProps {
  items: readonly ListItem[];
  rowOf: (item: ListItem, place?: RowPlace) => ReactNode;
}

interface SpriteTileProps extends SpriteItemProps {
  box: number;
  cell: VirtualGridCellBind;
}

interface SpriteButtonProps extends Omit<SpriteTileProps, 'artwork' | 'box'> {
  base: string;
  children: ReactNode;
}

interface SpriteViewProps {
  model: ManagerModel;
  affected: readonly SpriteId[];
  dragFor: (id: SpriteId) => SpriteDragHandlers;
  handlersFor: (id: SpriteId) => SpriteHandlers;
}

interface SpriteGridProps extends SpriteViewProps {
  box: number;
}

interface FilterOptions {
  sizes: readonly string[];
  tags: readonly string[];
  banks: readonly { id: string; name: string }[];
}

interface FilterActions {
  patch: (change: Partial<ManagerFilter>) => void;
  clear: () => void;
}

interface ListColumn {
  key: SortKey | null;
  label: 'name' | 'size' | 'pivot' | 'frames' | 'tags' | 'bank';
}

interface ListHeadCellProps {
  column: ListColumn;
  order: 'ascending' | 'descending' | 'none';
  onSort: () => void;
}

interface GridTileProps {
  view: SpriteGridProps;
  fact: SpriteFacts;
  cell: VirtualGridCellBind;
}

interface FolderHeaderProps {
  group: FolderGroup;
  place?: RowPlace;
}

interface SpriteBadgesProps {
  fact: SpriteFacts;
  twin: boolean;
}

interface ToolbarButtonProps {
  hint: HintSpec;
  disabled?: boolean;
  onClick: () => void;
  icon: ReactNode;
}

interface ActionContext {
  model: ManagerModel;
  sortKey: SortKey;
  rename: (id: SpriteId) => void;
  open: (dialog: ManagerDialog) => void;
  selections: readonly SavedSelection[];
}

interface ActionsMenuProps {
  groups: readonly MenuGroup[];
}

interface ManagerToolbarProps extends ActionsMenuProps {
  open: (dialog: ManagerDialog) => void;
  model: ManagerModel;
}

interface TileSize {
  width: VirtualSize;
  height: VirtualSize;
}

interface SpriteMarquee {
  area: RefObject<HTMLElement | null>;
  rect: Rect | null;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
}

interface KeyShape {
  key: string;
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

type SpriteKeyHandler = (event: KeyboardEvent<HTMLElement>) => void;

type KeyAction = () => void;

export type {
  ActionContext,
  ActionsMenuProps,
  FilterActions,
  FilterOptions,
  FolderHeaderProps,
  GridTileProps,
  KeyAction,
  KeyShape,
  ListColumn,
  ListHeadCellProps,
  ManagerModel,
  ManagerModelProps,
  ManagerToolbarProps,
  RowPlace,
  SpriteBadgesProps,
  SpriteButtonProps,
  SpriteDragHandlers,
  SpriteEvents,
  SpriteGridProps,
  SpriteHandlers,
  SpriteKeyHandler,
  SpriteMarquee,
  SpriteRenameProps,
  SpriteRenameState,
  SpriteRowProps,
  SpriteRowsProps,
  SpriteState,
  SpriteThumbProps,
  SpriteTileProps,
  SpriteViewProps,
  TileSize,
  ToolbarButtonProps,
};
