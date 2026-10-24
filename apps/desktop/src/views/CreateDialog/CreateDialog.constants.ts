/* @layer renderer-app @kind constants */
import { NEW_TEXT } from '../../new-sprite/new-sprite.constants';
import { platformGroups } from '../../platform-preset/platform-groups';
import type { BackgroundOption, KindOption } from './CreateDialog.type';

const KIND_OPTIONS: KindOption[] = [
  { value: 'sprite', label: NEW_TEXT.sprite },
  { value: 'sheet', label: NEW_TEXT.sheet },
];

const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { value: 'transparent', label: NEW_TEXT.transparentBackground },
  { value: 'opaque', label: NEW_TEXT.opaqueBackground },
];

const PLATFORM_GROUPS = platformGroups();

const NO_NAMES: readonly string[] = [];

const TRANSPARENT_OFF_REASON = 'Turn on the transparent slot to use a transparent background.';

export { BACKGROUND_OPTIONS, KIND_OPTIONS, NO_NAMES, PLATFORM_GROUPS, TRANSPARENT_OFF_REASON };
