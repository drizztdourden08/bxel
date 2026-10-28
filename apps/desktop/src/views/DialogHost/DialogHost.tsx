/* @layer renderer-app @kind component */
import { AddFramesDialog } from '../AddFramesDialog';
import { CanvasSizeDialog } from '../CanvasSizeDialog';
import { DirectionSetDialog } from '../DirectionSetDialog';
import { SelectionNamesDialog } from '../SelectionNamesDialog';
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
      <SelectionNamesDialog />
      <AddFramesDialog />
      <DirectionSetDialog />
      <ProjectCreateDialog />
      <ImportWizard />
      <PaletteChangeDialog />
    </>
  );
};

export { DialogHost };
