/* @layer renderer-app @kind component */
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { usePaletteSheetStore } from '../../stores/usePaletteSheetStore';
import { SheetDialog } from './sub-components/SheetDialog';
import './PaletteSheetDialog.css';

const PaletteSheetDialog = () => {
  const request = usePaletteSheetStore((state) => state.request);
  const target = useEditorTarget();
  if (!request || target?.documentId !== request.documentId || target.bank.id !== request.bankId) return null;
  return <SheetDialog request={request} target={target} />;
};

export { PaletteSheetDialog };
