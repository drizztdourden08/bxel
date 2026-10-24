/* @layer renderer-app @kind component */
import { useImportStore } from '../../stores/useImportStore';
import { ImportDialog } from './sub-components/ImportDialog';
import './ImportWizard.css';

const ImportWizard = () => {
  const image = useImportStore((state) => state.image);
  const tiled = useImportStore((state) => state.tiled);
  return image === null ? null : <ImportDialog key={image.fileName} image={image} tiled={tiled} />;
};

export { ImportWizard };
