/* @layer renderer-app @kind component */
import { ImportWizard } from '../ImportWizard';
import { CreateDialog } from '../CreateDialog';
import { ProjectCreateDialog } from '../ProjectCreateDialog';
import { PaletteChangeDialog } from '../PaletteChangeDialog';
import { useWindowDrop } from './behavior/useWindowDrop';

const DialogHost = () => {
  useWindowDrop();
  return (
    <>
      <CreateDialog />
      <ProjectCreateDialog />
      <ImportWizard />
      <PaletteChangeDialog />
    </>
  );
};

export { DialogHost };
