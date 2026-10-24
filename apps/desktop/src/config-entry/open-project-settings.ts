/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PROJECT_HUB } from './config-entry.constants';

const openProjectSettings = (page?: string): void => nav.open(page === undefined ? PROJECT_HUB : `${PROJECT_HUB}/${page}`);

export { openProjectSettings };
