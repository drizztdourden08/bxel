/* @layer renderer-app @kind logic */
import type { ShowContext } from '@drizztdourden08/brock-react';
import { PROJECT_FLAG } from '../asset-config/config-flags.constants';

const showProject = (open: boolean) => (ctx: ShowContext): boolean => (ctx.flags[PROJECT_FLAG] === true) === open;

export { showProject };
