/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import { hexesOf } from '../behavior/hexes-of';
import type { PresentRowsProps } from '../PaletteImportDialog.type';
import { ColourRow } from './ColourRow';

const PresentRows = ({ present, mode }: PresentRowsProps) => {
  if (present.length === 0 || mode !== 'append') return null;
  return (
    <>
      <ColourRow label={IMPORT_TEXT.presentLabel} colours={hexesOf(present)} />
      <Text variant="caption" tone="muted">{IMPORT_TEXT.present(present.length)}</Text>
    </>
  );
};

export { PresentRows };
