/* @layer renderer-app @kind logic */
import type { PlatformPreset } from '@bxel/presets';
import { presetDefaults } from '@bxel/presets';
import { sourceFromSet } from '../palette-source/source-from-set';
import { SOURCE_DEFAULT } from '../palette-source/palette-source.constants';
import { builtinSets } from '../swatch-library/builtin-sets';
import { setKey } from '../swatch-library/set-key';
import type { CreationForm } from './new-sprite.type';

const platformPatch = (preset: PlatformPreset, current: CreationForm): Partial<CreationForm> => {
  const defaults = presetDefaults(preset);
  const set = builtinSets().find((each) => each.key === setKey('builtin', preset.id));
  return {
    platformId: preset.id,
    width: defaults.spriteSize.width,
    height: defaults.spriteSize.height,
    cellWidth: defaults.spriteSize.width,
    cellHeight: defaults.spriteSize.height,
    limit: defaults.bankSize,
    transparent: defaults.transparent,
    source: set ? sourceFromSet(set, current.source) : SOURCE_DEFAULT,
  };
};

export { platformPatch };
