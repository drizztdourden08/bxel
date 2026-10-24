/* @layer renderer-app @kind logic */
import type { CreationForm, CreationMemory } from './new-sprite.type';

const formMemory = (form: CreationForm, previous: CreationMemory): CreationMemory => ({
  width: form.kind === 'sprite' ? form.width : previous.width,
  height: form.kind === 'sprite' ? form.height : previous.height,
  limit: form.limit,
  transparent: form.transparent,
  presetId: form.source.kind === 'preset' ? form.source.presetId : previous.presetId,
  ...(form.platformId === null ? {} : { platformId: form.platformId }),
});

export { formMemory };
