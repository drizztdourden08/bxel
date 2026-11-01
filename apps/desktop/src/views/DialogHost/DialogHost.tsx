/* @layer renderer-app @kind component */
import { AddFramesDialog } from '../AddFramesDialog';
import { CanvasSizeDialog } from '../CanvasSizeDialog';
import { CustomizeTools } from '../CustomizeTools';
import { DirectionSetDialog } from '../DirectionSetDialog';
import { MoveToDialog } from '../MoveToDialog';
import { PasteChoiceDialog } from '../PasteChoiceDialog';
import { SelectionNamesDialog } from '../SelectionNamesDialog';
import { SliceDialog } from '../SliceDialog';
import { ImportWizard } from '../ImportWizard';
import { LinkedCelDialog } from '../LinkedCelDialog';
import { CreateDialog } from '../CreateDialog';
import { ProjectCreateDialog } from '../ProjectCreateDialog';
import { PaletteChangeDialog } from '../PaletteChangeDialog';
import { PresetDialog } from '../PresetDialog';
import { PaletteImportDialog } from '../PaletteImportDialog';
import { PaletteSheetDialog } from '../PaletteSheetDialog';
import { RampBuilderDialog } from '../RampBuilderDialog';
import { useWindowDrop } from './behavior/useWindowDrop';

const DialogHost = () => {
  useWindowDrop();
  return (
    <>
      <CreateDialog />
      <CanvasSizeDialog />
      <SelectionNamesDialog />
      <SliceDialog />
      <PasteChoiceDialog />
      <AddFramesDialog />
      <DirectionSetDialog />
      <ProjectCreateDialog />
      <ImportWizard />
      <PaletteChangeDialog />
      <PresetDialog />
      <CustomizeTools />
      <RampBuilderDialog />
      <PaletteSheetDialog />
      <PaletteImportDialog />
      <LinkedCelDialog />
      <MoveToDialog />
    </>
  );
};

export { DialogHost };
