/* @layer renderer-app @kind component */
import { useImportStore } from '../../stores/useImportStore';
import { ImportDialog } from './sub-components/ImportDialog';
import './ImportWizard.css';

const ImportWizard = () => {
  const image = useImportStore((state) => state.image);
  return image === null ? null : <ImportDialog key={image.fileName} image={image} />;
};

export { ImportWizard };
