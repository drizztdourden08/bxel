/* @layer renderer-app @kind logic */
import type { Grant } from '@bxel/mcp';

const withMayRestart = (grant: Grant, mayRestart: boolean): Grant => ({ ...grant, special: { ...grant.special, mayRestart } });

export { withMayRestart };
