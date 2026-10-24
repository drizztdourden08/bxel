/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera';
import { SHEET_CANVAS_TEXT } from './SheetCanvas.constants';
import { useSheetView } from './behavior/useSheetView';
import { SheetSurface } from './sub-components/SheetSurface';
import './SheetCanvas.css';

const SheetCanvas = () => {
  const sheet = useSheetView();
  if (!sheet) return <EmptyState message={SHEET_CANVAS_TEXT.empty} />;
  return <SheetSurface sheet={sheet} />;
};

export { SheetCanvas };
