/* @layer renderer-app @kind logic */
import { applyPreview } from '../editor/pending/apply-preview';
import { hasPreview } from '../editor/pending/has-preview';
import { isolateSprite } from './isolate-sprite';

const enterAction = (): void => {
  if (hasPreview()) applyPreview();
  else isolateSprite();
};

export { enterAction };
