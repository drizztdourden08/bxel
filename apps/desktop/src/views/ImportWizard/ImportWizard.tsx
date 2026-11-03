/* @layer renderer-app @kind component */
import { useImportStore } from '../../stores/useImportStore';
import { ImportDialog } from './sub-components/ImportDialog';
import './ImportWizard.css';

const ImportWizard = () => {
  const image = useImportStore((state) => state.image);
  const tiled = useImportStore((state) => state.tiled);
  const kind = useImportStore((state) => state.kind);
  const sheetId = useImportStore((state) => state.sheetId);
  return image === null ? null : <ImportDialog key={image.fileName} image={image} tiled={tiled} kind={kind} sheetId={sheetId} />;
};

export { ImportWizard };
