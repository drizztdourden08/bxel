/* @layer core @kind logic */
import type { ExportPreset } from '../../model/export-preset.type';
import type { SpriteId } from '../../model/ids.type';

const retargetPresets = (presets: readonly ExportPreset[], spriteId: SpriteId, firstFrame: SpriteId | null): readonly ExportPreset[] =>
  presets.map((preset) => {
    if (!preset.scope.sprites.includes(spriteId) || firstFrame === null) return preset;
    const sprites = [...new Set(preset.scope.sprites.map((ref) => (ref === spriteId ? firstFrame : ref)))];
    return { ...preset, scope: { ...preset.scope, sprites, frames: { by: 'all' } } };
  });

export { retargetPresets };
