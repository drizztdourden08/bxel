/* @layer renderer-app @kind constants */
import { NEW_TEXT } from '../../new-sprite/new-sprite.constants';
import { platformGroups } from '../../platform-preset/platform-groups';
import type { CreationKind } from '../../new-sprite/new-sprite.type';
import type { BackgroundOption, KindOption } from './CreateDialog.type';

const KIND_OPTIONS: KindOption[] = [
  { value: 'sprite', label: NEW_TEXT.sprite },
  { value: 'animation', label: NEW_TEXT.animation },
  { value: 'sheet', label: NEW_TEXT.sheet },
  { value: 'palette', label: NEW_TEXT.paletteKind },
  { value: 'tileset', label: NEW_TEXT.tileset },
  { value: 'tilemap', label: NEW_TEXT.tilemap },
];

const CREATE_LABEL: Readonly<Record<CreationKind, string>> = {
  sprite: NEW_TEXT.create,
  animation: NEW_TEXT.createAnimation,
  sheet: NEW_TEXT.createSheet,
  palette: NEW_TEXT.createPalette,
  tileset: NEW_TEXT.createTileset,
  tilemap: NEW_TEXT.createTilemap,
};

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { value: 'transparent', label: NEW_TEXT.transparentBackground },
  { value: 'opaque', label: NEW_TEXT.opaqueBackground },
];

const PLATFORM_GROUPS = platformGroups();

const WORKSPACE_KINDS: readonly CreationKind[] = ['animation', 'palette', 'tileset', 'tilemap'];

const NO_NAMES: readonly string[] = [];

const TRANSPARENT_OFF_REASON = 'Turn on the transparent slot to use a transparent background.';

export { BACKGROUND_OPTIONS, CREATE_LABEL, KIND_OPTIONS, NO_NAMES, PLATFORM_GROUPS, TRANSPARENT_OFF_REASON, WORKSPACE_KINDS };
