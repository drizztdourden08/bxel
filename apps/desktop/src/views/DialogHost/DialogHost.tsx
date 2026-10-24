/* @layer renderer-app @kind component */
import { ImportWizard } from '../ImportWizard';
import { CreateDialog } from '../CreateDialog';
import { PaletteChangeDialog } from '../PaletteChangeDialog';
import { useWindowDrop } from './behavior/useWindowDrop';

const DialogHost = () => {
  useWindowDrop();
  return (
    <>
      <CreateDialog />
      <ImportWizard />
      <PaletteChangeDialog />
    </>
  );
};

export { DialogHost };
