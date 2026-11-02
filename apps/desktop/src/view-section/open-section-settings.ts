/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { OPTIONS_HUB } from '../config-entry/config-entry.constants';
import { SECTION_PAGES } from './view-section.constants';
import type { ViewSectionId } from './view-section.type';

const openSectionSettings = (section: ViewSectionId): void => nav.open(`${OPTIONS_HUB}/${SECTION_PAGES[section]}`);

export { openSectionSettings };
