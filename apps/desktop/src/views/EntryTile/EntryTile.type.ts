/* @layer renderer-app @kind types */
import type { VirtualGridCellBind, VirtualSize } from '@drizztdourden08/tessera';
import type { Animation, Artwork, Sprite, TagId } from '@bxel/document';
import type { PickHow } from '../../sheet/sheet.type';
import type { EntryDragSpec } from '../../sheet-manager/drag-payload.type';
import type { EntryFacts } from '../../sheet-manager/manager.type';

type EntryMark = 'before' | 'after';

interface EntryTileState {
  mark: EntryMark | null;
  selected: boolean;
  active: boolean;
  affected: boolean;
  loose: boolean;
  twin: boolean;
}

interface EntryTileHandlers {
  onPick: (how: PickHow) => void;
  onEdit: () => void;
  onRename: () => void;
  onMenu: () => void;
}

interface EntryTileProps {
  fact: EntryFacts;
  artwork: Artwork;
  box: number;
  state: EntryTileState;
  drag: EntryDragSpec;
  handlers: EntryTileHandlers;
  cell: VirtualGridCellBind;
}

interface SpriteThumbProps {
  artwork: Artwork;
  sprite: Sprite;
  box: number;
}

interface AnimationThumbProps {
  artwork: Artwork;
  animation: Animation;
  tagId: TagId | null;
  box: number;
  playing: boolean;
}

interface TileSize {
  width: VirtualSize;
  height: VirtualSize;
}

interface EntryNameProps {
  name: string;
}

interface EntryThumbProps {
  fact: EntryFacts;
  artwork: Artwork;
  box: number;
  playing: boolean;
}

interface EntryBadgesProps {
  fact: EntryFacts;
  twin: boolean;
}

export type { AnimationThumbProps, EntryBadgesProps, EntryNameProps, EntryThumbProps, EntryTileHandlers, EntryTileProps, EntryTileState, SpriteThumbProps, TileSize };
