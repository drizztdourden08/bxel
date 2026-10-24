/* @layer renderer-app @kind component */
import { useCanvasSizeStore } from '../../stores/useCanvasSizeStore';
import { CanvasSizeContent } from './sub-components/CanvasSizeContent';

const CanvasSizeDialog = () => {
  const open = useCanvasSizeStore((state) => state.open);
  return open ? <CanvasSizeContent /> : null;
};

export { CanvasSizeDialog };
