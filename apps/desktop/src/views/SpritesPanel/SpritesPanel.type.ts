/* @layer renderer-app @kind types */
import type { DragEvent, KeyboardEvent } from 'react';
import type { Sprite, SpriteId } from '@bxel/document';
import type { FrameImage, PickHow, SpriteScene } from '../../sheet/sheet.type';

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
  image: FrameImage | null;
}

interface SpriteDragHandlers {
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

interface SpriteTileProps {
  sprite: Sprite;
  image: FrameImage | null;
  selected: boolean;
  active: boolean;
  affected: boolean;
  drag: SpriteDragHandlers;
  onPick: (how: PickHow) => void;
  onRename: () => void;
}

interface SpritesToolbarProps {
  scene: SpriteScene;
}

type SpriteKeyHandler = (event: KeyboardEvent<HTMLElement>) => void;

type KeyAction = () => void;

export type { KeyAction, SpriteDragHandlers, SpriteKeyHandler, SpriteRenameProps, SpriteRenameState, SpriteThumbProps, SpriteTileProps, SpritesToolbarProps };
