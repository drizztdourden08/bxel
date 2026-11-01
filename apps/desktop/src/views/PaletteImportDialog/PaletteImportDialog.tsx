/* @layer renderer-app @kind component */
import { usePaletteTarget } from '../../hooks/usePaletteTarget';
import { usePaletteImportStore } from '../../stores/usePaletteImportStore';
import { ImportDialog } from './sub-components/ImportDialog';
import './PaletteImportDialog.css';

const PaletteImportDialog = () => {
  const request = usePaletteImportStore((state) => state.request);
  const target = usePaletteTarget();
  if (!request || target?.documentId !== request.documentId || target.bank.id !== request.bankId) return null;
  return <ImportDialog request={request} target={target} />;
};

export { PaletteImportDialog };
