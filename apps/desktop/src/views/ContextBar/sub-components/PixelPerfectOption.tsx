/* @layer renderer-app @kind component */
import { Checkbox } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { CONTEXT_TEXT } from '../ContextBar.constants';

const PixelPerfectOption = () => {
  const on = useToolStore((state) => state.pixelPerfect);
  const setOn = useToolStore((state) => state.setPixelPerfect);
  return <Checkbox size="sm" label={CONTEXT_TEXT.pixelPerfect} checked={on} onChange={setOn} />;
};

export { PixelPerfectOption };
