/* @layer electron-main @kind logic */
import { SESSION_TOKEN_PATTERN } from '@bxel/mcp';
import { LAUNCH } from '../../src/assistant-bridge/launch.constants';
import type { InstanceState } from './assistant.type';

const readInstance = (argv: readonly string[] = process.argv, env: NodeJS.ProcessEnv = process.env): InstanceState => {
  const flag = argv.find((arg) => arg.startsWith(`${LAUNCH.startFlag}=`))?.slice(LAUNCH.startFlag.length + 1);
  const started = flag === 'headless' || flag === 'visible';
  const token = env[LAUNCH.tokenEnv];
  return {
    window: flag === 'headless' ? 'headless' : 'visible',
    started,
    launchToken: started && token !== undefined && SESSION_TOKEN_PATTERN.test(token) ? token : null,
  };
};

export { readInstance };
