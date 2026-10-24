/* @layer renderer-app @kind logic */
import { presetById } from '../platform-preset/preset-by-id';
import type { CreationForm } from './new-sprite.type';
import { platformPatch } from './platform-patch';

const changePlatform = (form: CreationForm, value: string): Partial<CreationForm> => {
  const preset = presetById(value);
  return preset ? platformPatch(preset, form) : { platformId: null };
};

export { changePlatform };
