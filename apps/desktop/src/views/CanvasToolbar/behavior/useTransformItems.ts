/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { buttonItem } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import {
  FLIP_H_HINT, FLIP_V_HINT, ROTATE_HINT, SCALE_HINT, TRANSFORM_CAPTION, TRANSFORM_HINT, TURN_CCW_HINT, TURN_CW_HINT,
} from '../sub-components/TransformMenu.constants';
import { transformGroups } from './transform-groups';

const useTransformItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const keys = {
    'flip-h': useHintKeys(FLIP_H_HINT),
    'flip-v': useHintKeys(FLIP_V_HINT),
    'turn-cw': useHintKeys(TURN_CW_HINT),
    'turn-ccw': useHintKeys(TURN_CCW_HINT),
    rotate: useHintKeys(ROTATE_HINT),
    scale: useHintKeys(SCALE_HINT),
  };
  return [
    buttonItem({
      id: 'transform', icon: 'rotate-ccw', hint: TRANSFORM_HINT, caption: TRANSFORM_CAPTION, disabled, options: transformGroups(keys), onSelect: () => undefined,
    }),
  ];
};

export { useTransformItems };
