/* @layer renderer-app @kind types */
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode, RefObject } from 'react';
import type { DataTableHandle, MenuGroup, VirtualGridCellBind } from '@drizztdourden08/tessera';
import type { Artwork, Rect, Sheet, SpriteId } from '@bxel/document';
import type { SpriteScene } from '../../sheet/sheet.type';
import type { FolderGroup, SavedSelection } from '../../sheet-manager/folders.type';
import type { AnimationFacts, EntryFacts, ManagerDialog, ManagerFilter, SortKey, SpriteFacts } from '../../sheet-manager/manager.type';
import type { EntryDrag } from './behavior/useSpriteDrag.type';
import type { EntryTileDrag, EntryTileHandlers, EntryTileState } from '../EntryTile/EntryTile.type';

interface ManagerModel {
  artwork: Artwork;
  scene: SpriteScene;
  sheet: Sheet | null;
  facts: readonly SpriteFacts[];
  shown: readonly SpriteFacts[];
  animationFacts: readonly AnimationFacts[];
  animations: readonly AnimationFacts[];
  picked: readonly string[];
  library: { sprites: readonly SpriteFacts[]; animations: readonly AnimationFacts[] };
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

interface SheetZoneProps {
  model: ManagerModel;
  onKeyDown: SpriteKeyHandler;
  bind: EntryDrag['zone'];
  children: ReactNode;
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

type SpriteDragHandlers = EntryTileDrag;

type SpriteState = EntryTileState;

type SpriteHandlers = EntryTileHandlers;

interface ListRow {
  id: string;
  kind: 'sprite' | 'animation';
  name: string;
  folder: string;
  width: number;
  height: number;
  pivot: string;
  bank: string;
  at: string;
  frames: string;
  loose: boolean;
}

interface ListData {
  rows: readonly ListRow[];
  selected: ReadonlySet<string>;
  known: ReadonlyMap<string, SpriteId>;
  animationKeys: ReadonlySet<string>;
  facts: ReadonlyMap<string, EntryFacts>;
  folders: readonly string[];
}

interface SpriteNameCellProps {
  artwork: Artwork;
  fact: EntryFacts;
  loose: boolean;
}

interface SpriteViewProps {
  model: ManagerModel;
  table: RefObject<DataTableHandle | null>;
  affected: readonly SpriteId[];
  dragFor: (id: string) => SpriteDragHandlers;
  handlersFor: (id: string) => SpriteHandlers;
  marks: ReadonlyMap<string, 'before' | 'after'>;
}

interface SpriteGridProps extends SpriteViewProps {
  box: number;
}

interface FilterOptions {
  sizes: readonly string[];
  tags: readonly string[];
  banks: readonly { id: string; name: string }[];
}

interface FilterChip {
  id: string;
  label: string;
  clear: () => void;
}

interface FilterActions {
  patch: (change: Partial<ManagerFilter>) => void;
  clear: () => void;
}

interface GridTileProps {
  view: SpriteGridProps;
  fact: EntryFacts;
  cell: VirtualGridCellBind;
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

interface BrowserSplitProps {
  model: ManagerModel;
  wide: boolean;
  body: ReactNode;
}

interface BatchBarProps extends ActionsMenuProps {
  model: ManagerModel;
  open: (dialog: ManagerDialog) => void;
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
  BatchBarProps,
  BrowserSplitProps,
  FilterActions,
  FilterChip,
  FilterOptions,
  GridTileProps,
  KeyAction,
  KeyShape,
  ListData,
  ListRow,
  ManagerModel,
  ManagerModelProps,
  SpriteDragHandlers,
  SpriteGridProps,
  SpriteHandlers,
  SheetZoneProps,
  SpriteKeyHandler,
  SpriteNameCellProps,
  SpriteMarquee,
  SpriteRenameProps,
  SpriteRenameState,
  SpriteState,
  SpriteViewProps,
};
