/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import { hexesOf } from '../behavior/hexes-of';
import type { OverRowsProps } from '../PaletteImportDialog.type';
import { ColourRow } from './ColourRow';

const OverRows = ({ over, free }: OverRowsProps) => {
  if (over.length === 0) return null;
  return (
    <>
      <ColourRow label={IMPORT_TEXT.overLabel} colours={hexesOf(over)} />
      <Callout tone="warning">{IMPORT_TEXT.over(over.length, free)}</Callout>
    </>
  );
};

export { OverRows };
