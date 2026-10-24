/* @layer helper @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolOutcome } from '@bxel/mcp';
import { randomBytes } from 'crypto';
import { EXIT_CODE } from '../assistant-bridge/launch.constants';
import { HELPER_TEXT } from './helper.constants';
import { helperLog } from './helper-log';
import type { DiscoveryWait, HelperState } from './helper.type';
import { launchOf } from './launch-of';
import { spawnBxel } from './spawn-bxel';
import { waitForDiscovery } from './wait-for-discovery';

const exitFailure = (code: number | null): ToolOutcome => {
  if (code === EXIT_CODE.disabled) return mcpFailure(MCP_ERROR_CODE.MCP_DISABLED, HELPER_TEXT.disabled);
  if (code === EXIT_CODE.startOff) return mcpFailure(MCP_ERROR_CODE.START_NOT_ALLOWED, HELPER_TEXT.startOff);
  return mcpFailure(MCP_ERROR_CODE.START_FAILED, HELPER_TEXT.startExit(code));
};

const waitFailure = (wait: DiscoveryWait): ToolOutcome | null => {
  if (wait.kind === 'ready') return null;
  return wait.kind === 'exit' ? exitFailure(wait.code) : mcpFailure(MCP_ERROR_CODE.START_FAILED, HELPER_TEXT.startTimeout);
};

const startBxel = async (state: HelperState, window: 'headless' | 'visible'): Promise<ToolOutcome> => {
  if (state.session.isRunning()) {
    if (window === 'visible') await state.session.call('show_window', {});
    return { ok: true, started: false, window, launchedBy: state.started ? 'this_helper' : 'owner', readyMs: 0 };
  }
  const launch = launchOf(state.file);
  if (!launch) return mcpFailure(MCP_ERROR_CODE.START_FAILED, HELPER_TEXT.noLaunch);
  const token = randomBytes(32).toString('hex');
  const since = Date.now();
  const started = spawnBxel(launch, window, token);
  helperLog(`start_bxel: started Bxel ${window}, pid ${started.child.pid ?? 'unknown'}`);
  const failed = waitFailure(await waitForDiscovery(state.file, started, since));
  if (failed) return failed;
  state.session.setLaunchToken(token);
  state.started = started;
  return { ok: true, started: true, window, launchedBy: 'this_helper', readyMs: Date.now() - since };
};

export { startBxel };
