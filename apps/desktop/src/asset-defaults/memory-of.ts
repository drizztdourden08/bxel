/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import type { CreationMemory } from '../new-sprite/new-sprite.type';
import { PRESET_DEFAULT } from '../palette-source/palette-source.constants';

const memoryOf = (defaults: AssetDefaults): CreationMemory => ({
  width: defaults.size.width,
  height: defaults.size.height,
  limit: defaults.colorLimit,
  transparent: defaults.transparent,
  presetId: defaults.palette.kind === 'preset' ? defaults.palette.presetId : PRESET_DEFAULT,
  ...(defaults.platformId === null ? {} : { platformId: defaults.platformId }),
});

export { memoryOf };
