/* @layer renderer-app @kind component */
import { useExportStore } from '../../export/useExportStore';
import { ExportForm } from './sub-components/ExportForm';
import './ExportDialog.css';

const ExportDialog = () => {
  const open = useExportStore((state) => state.open);
  return open ? <ExportForm /> : null;
};

export { ExportDialog };
