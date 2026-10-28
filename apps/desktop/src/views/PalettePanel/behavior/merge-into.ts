/* @layer renderer-app @kind logic */
import { startChange } from '../../../palette-change/start-change';
import { useChangeStore } from '../../../stores/useChangeStore';
import type { SwatchEditModel } from '../PalettePanel.type';

const mergeInto = (editor: SwatchEditModel, other: number): void => {
  const index = editor.index;
  editor.cancel();
  if (index === null) return;
  startChange('merge', index);
  useChangeStore.getState().setOther(other);
};

export { mergeInto };
