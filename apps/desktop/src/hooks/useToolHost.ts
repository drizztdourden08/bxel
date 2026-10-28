/* @layer renderer-app @kind hook */
import { useToolPersistence } from './useToolPersistence';
import { useToolRecents } from './useToolRecents';
import { useToolSurface } from './useToolSurface';

const useToolHost = (): void => {
  useToolSurface();
  useToolRecents();
  useToolPersistence();
};

export { useToolHost };
