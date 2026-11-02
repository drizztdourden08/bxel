/* @layer renderer-app @kind hook */
import type { TagId } from '@bxel/document';
import { useCallback, useState } from 'react';
import { editAnimationTag } from '../../../asset-config/edit-animation-tag';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import type { TagRowModel, TagsControlModel } from '../AssetControl.type';

const useTagsControl = (): TagsControlModel | null => {
  const focus = useAssetFocus();
  const [problem, setProblem] = useState<string | null>(null);
  const animation = focus ? focusAssetOf(focus, 'animation') : undefined;
  const edit = useCallback(
    (tagId: TagId, fields: Readonly<Record<string, unknown>>): void => {
      if (focus) setProblem(editAnimationTag(focus, tagId, fields));
    },
    [focus],
  );
  if (!animation) return null;
  const rows = animation.tags.flatMap((tag): TagRowModel[] => (tag.kind === 'span' ? [{ id: tag.id, name: tag.name, direction: tag.direction, repeat: tag.repeat }] : []));
  return { rows, mirrors: animation.tags.length - rows.length, readOnly: focus?.readOnly ?? false, problem, edit };
};

export { useTagsControl };
