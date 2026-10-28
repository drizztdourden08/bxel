/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PROJECT_HUB } from './config-entry.constants';

const openProjectWindow = (): void => nav.open(PROJECT_HUB);

export { openProjectWindow };
