/* @layer renderer-app @kind logic */
import { useTransformUiStore } from '../../stores/useTransformUiStore';
import { beginPending } from '../pending/begin-pending';
import { activeTransform } from './active-transform';
import { IDENTITY } from './transform.constants';
import type { TransformField } from './transform.type';

const startTransform = (focus: TransformField | null = null): boolean => {
  const opened = activeTransform() !== null || beginPending({ ...IDENTITY });
  if (opened) useTransformUiStore.getState().setFocus(focus);
  return opened;
};

export { startTransform };
