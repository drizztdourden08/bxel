/* @layer renderer-app @kind logic */
import { SECTION_RESETS } from './section-resets.constants';
import type { ViewSectionId } from './view-section.type';

const resetSection = (section: ViewSectionId): void => SECTION_RESETS[section]?.();

export { resetSection };
