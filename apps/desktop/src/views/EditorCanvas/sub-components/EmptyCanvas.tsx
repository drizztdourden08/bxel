/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { EDITOR_CANVAS_TEXT } from '../EditorCanvas.constants';
import { EmptyFrame } from './EmptyFrame';

const EmptyCanvas = () => {
  const focus = useAnimationFocus();
  return focus ? <EmptyFrame readOnly={focus.readOnly} /> : <EmptyState message={EDITOR_CANVAS_TEXT.empty} />;
};

export { EmptyCanvas };
