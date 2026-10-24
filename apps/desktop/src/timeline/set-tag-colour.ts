/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import { changeTag } from './change-tag';
import { TIMELINE_LABEL } from './timeline.constants';

const setTagColour = (tagId: TagId, colour: string | null): boolean => changeTag(TIMELINE_LABEL.colourTag, tagId, { colour });

export { setTagColour };
