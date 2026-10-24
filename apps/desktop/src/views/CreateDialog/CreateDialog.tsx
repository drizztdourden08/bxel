/* @layer renderer-app @kind component */
import { useCreateDialogStore } from '../../stores/useCreateDialogStore';
import { CreateFileDialog } from './sub-components/CreateFileDialog';
import { CreateSpriteDialog } from './sub-components/CreateSpriteDialog';
import './CreateDialog.css';

const CreateDialog = () => {
  const mode = useCreateDialogStore((state) => state.mode);
  if (mode === 'file') return <CreateFileDialog />;
  return mode === 'sprite' ? <CreateSpriteDialog /> : null;
};

export { CreateDialog };
