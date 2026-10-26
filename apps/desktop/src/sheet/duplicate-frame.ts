/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { currentFocus } from '../timeline/current-focus';
import { duplicateFrames } from '../timeline/duplicate-frames';
import { TIMELINE_TEXT } from '../timeline/timeline.constants';

const duplicateFrame = (): void => {
  if (currentFocus()) {
    duplicateFrames();
    return;
  }
  toast(TIMELINE_TEXT.stillImages, { variant: 'info' });
};

export { duplicateFrame };
