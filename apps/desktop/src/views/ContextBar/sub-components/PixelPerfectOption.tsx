/* @layer renderer-app @kind component */
import { Checkbox } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint } from '../../ActionHint';
import { CONTEXT_TEXT, PIXEL_PERFECT_HINT } from '../ContextBar.constants';

const PixelPerfectOption = () => {
  const on = useToolStore((state) => state.pixelPerfect);
  const setOn = useToolStore((state) => state.setPixelPerfect);
  return (
    <ActionHint hint={PIXEL_PERFECT_HINT}>
      <Checkbox size="sm" label={CONTEXT_TEXT.pixelPerfect} checked={on} onChange={setOn} />
    </ActionHint>
  );
};

export { PixelPerfectOption };
