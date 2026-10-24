/* @layer renderer-app @kind types */
import type { DragEvent, KeyboardEvent, MouseEvent, PointerEvent, ReactNode, RefObject } from 'react';
import type { MenuGroup } from '@drizztdourden08/tessera';
import type { Artwork, Sheet, Sprite, SpriteId } from '@bxel/document';
import type { PickHow, SpriteScene } from '../../sheet/sheet.type';
import type { ManagerDialog, ManagerFilter, SortKey, SpriteFacts } from '../../sheet-manager/manager.type';

interface ManagerModel {
  artwork: Artwork;
  scene: SpriteScene;
  sheet: Sheet | null;
  facts: readonly SpriteFacts[];
  shown: readonly SpriteFacts[];
  order: readonly SpriteId[];
  sizes: readonly string[];
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
}

interface SpriteHandlers {
  onPick: (how: PickHow) => void;
  onRename: () => void;
  onMenu: (event: MouseEvent<HTMLElement>) => void;
}

interface SpriteItemProps {
  fact: SpriteFacts;
  artwork: Artwork;
  state: SpriteState;
  drag: SpriteDragHandlers;
  handlers: SpriteHandlers;
}

interface SpriteTileProps extends SpriteItemProps {
  box: number;
}

interface SpriteButtonProps extends Omit<SpriteItemProps, 'artwork'> {
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

interface SpriteBadgesProps {
  fact: SpriteFacts;
}

interface ToolbarButtonProps {
  label: string;
  keys?: string;
  disabled?: boolean;
  onClick: () => void;
  icon: ReactNode;
}

interface ActionContext {
  model: ManagerModel;
  sortKey: SortKey;
  rename: (id: SpriteId) => void;
  open: (dialog: ManagerDialog) => void;
}

interface ActionsMenuProps {
  groups: readonly MenuGroup[];
}

interface ManagerToolbarProps {
  model: ManagerModel;
  groups: readonly MenuGroup[];
}

interface ContextMenuState {
  open: boolean;
  anchor: RefObject<HTMLElement | null>;
  show: (event: MouseEvent<HTMLElement>) => void;
  hide: () => void;
}

interface BandState {
  canvas: RefObject<HTMLCanvasElement | null>;
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
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
  BandState,
  ContextMenuState,
  FilterActions,
  KeyAction,
  KeyShape,
  ListColumn,
  ListHeadCellProps,
  ManagerModel,
  ManagerModelProps,
  ManagerToolbarProps,
  SpriteBadgesProps,
  SpriteButtonProps,
  SpriteDragHandlers,
  SpriteGridProps,
  SpriteHandlers,
  SpriteItemProps,
  SpriteKeyHandler,
  SpriteRenameProps,
  SpriteRenameState,
  SpriteState,
  SpriteThumbProps,
  SpriteTileProps,
  SpriteViewProps,
  ToolbarButtonProps,
};
