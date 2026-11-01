/* @layer renderer-app @kind hook */
import { usePresetKeyCommands } from './usePresetKeyCommands';
import { useToolPersistence } from './useToolPersistence';
import { useToolRecents } from './useToolRecents';
import { useToolSurface } from './useToolSurface';

const useToolHost = (): void => {
  useToolSurface();
  useToolRecents();
  useToolPersistence();
  usePresetKeyCommands();
};

export { useToolHost };
