/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFocus, AssetOutcome } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { runField } from './run-field';

const editAnimationTag = (focus: AssetFocus, tagId: TagId, fields: Readonly<Record<string, unknown>>): AssetOutcome => {
  const animation = focusAssetOf(focus, 'animation');
  if (!animation) return null;
  const options = { animation: animation.id, tag: { by: 'id', id: tagId }, ...fields };
  return runField(focus, ASSET_LABEL.tag, [{ name: COMMAND_NAME.animationTagUpdate, targets: null, options }]);
};

export { editAnimationTag };
