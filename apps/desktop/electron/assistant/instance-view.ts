/* @layer electron-main @kind logic */
import type { InstanceView, LaunchedBy } from '@bxel/mcp';
import type { AssistantMain, LiveSession } from './assistant.type';

const launchedBy = (state: AssistantMain, session: LiveSession): LaunchedBy => {
  if (!state.instance.started) return 'owner';
  return session.launchedThis ? 'this_helper' : 'other_helper';
};

const instanceView = (state: AssistantMain, session: LiveSession): InstanceView => ({
  window: state.instance.window,
  launchedBy: launchedBy(state, session),
  canStop: session.launchedThis && state.instance.window === 'headless',
});

export { instanceView };
