/* @layer renderer-app @kind component */
import { useAnimationFocus } from '../../hooks/useAnimationFocus';
import { useAddFramesStore } from '../../stores/useAddFramesStore';
import { SheetDialog } from './sub-components/SheetDialog';
import { SpritesDialog } from './sub-components/SpritesDialog';
import { StripDialog } from './sub-components/StripDialog';

const AddFramesDialog = () => {
  const mode = useAddFramesStore((state) => state.mode);
  const focus = useAnimationFocus();
  if (mode === null || !focus) return null;
  if (mode === 'sprites') return <SpritesDialog focus={focus} />;
  return mode === 'strip' ? <StripDialog focus={focus} /> : <SheetDialog focus={focus} />;
};

export { AddFramesDialog };
