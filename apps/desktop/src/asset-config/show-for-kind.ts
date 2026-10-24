/* @layer renderer-app @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { KIND_FLAG } from './config-flags.constants';

const showForKind = (...kinds: readonly string[]) => (ctx: ShowContext): boolean => kinds.includes(String(ctx.flags[KIND_FLAG] ?? ''));

export { showForKind };
