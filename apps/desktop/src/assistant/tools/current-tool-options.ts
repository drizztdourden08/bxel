/* @layer renderer-app @kind logic */
import { brushOf } from '../../editor/brush-of';
import { inkOf } from '../../editor/ink-of';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { useToolStore } from '../../stores/useToolStore';
import { CURRENT } from './current-tool-options.constants';

const currentToolOptions = (options: unknown): unknown => {
  if (typeof options !== 'object' || options === null) return options;
  const brush = Reflect.get(options, 'brush') === CURRENT;
  const ink = Reflect.get(options, 'ink') === CURRENT;
  if (!brush && !ink) return options;
  const tools = useToolStore.getState();
  const next: Record<string, unknown> = { ...options };
  if (brush) next.brush = brushOf(tools);
  if (ink) {
    const built = inkOf('foreground', tools, useDrawingStore.getState()).ink;
    if (built === undefined) delete next.ink;
    else next.ink = built;
  }
  return next;
};

export { currentToolOptions };
