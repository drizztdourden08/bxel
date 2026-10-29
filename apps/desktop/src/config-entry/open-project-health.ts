/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PROJECT_HUB } from './config-entry.constants';

const openProjectHealth = (): void => nav.open(`${PROJECT_HUB}/health`);

export { openProjectHealth };
