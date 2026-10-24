/* @layer renderer-app @kind hook */
import type { SwatchSetEditorModel } from '../SwatchSetEditor.type';
import { useEditorState } from './useEditorState';
import { useSetCommands } from './useSetCommands';
import { useSetSources } from './useSetSources';

const useSwatchSetEditor = (): SwatchSetEditorModel => {
  const state = useEditorState();
  const commands = useSetCommands(state);
  const sources = useSetSources(state);
  return { ...state, ...commands, ...sources };
};

export { useSwatchSetEditor };
