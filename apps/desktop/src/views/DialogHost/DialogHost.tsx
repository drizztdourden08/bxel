/* @layer renderer-app @kind component */
import { AddFramesDialog } from '../AddFramesDialog';
import { CanvasSizeDialog } from '../CanvasSizeDialog';
import { DirectionSetDialog } from '../DirectionSetDialog';
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
      <CanvasSizeDialog />
      <AddFramesDialog />
      <DirectionSetDialog />
      <ProjectCreateDialog />
      <ImportWizard />
      <PaletteChangeDialog />
    </>
  );
};

export { DialogHost };
