/* @layer renderer-app @kind component */
import { Button, Text } from '@drizztdourden08/tessera';
import { deleteSavedSelection } from '../../../editor/selection/delete-saved-selection';
import { loadSavedSelection } from '../../../editor/selection/load-saved-selection';
import { LOAD_MODES, SELECTION_NAMES_TEXT } from '../SelectionNamesDialog.constants';
import type { SavedRowProps } from '../SelectionNamesDialog.type';

const SavedRow = ({ selection, stale, modeLabels }: SavedRowProps) => (
  <>
    <Text as="span" variant="label" className="selection-names__name">{selection.name}</Text>
    <Text as="span" variant="caption">{stale ? SELECTION_NAMES_TEXT.stale : SELECTION_NAMES_TEXT.size(selection.width, selection.height)}</Text>
    {LOAD_MODES.map((mode) => (
      <Button key={mode} variant="secondary" size="sm" disabled={stale} aria-label={SELECTION_NAMES_TEXT.loadAs(modeLabels[mode], selection.name)} onClick={() => loadSavedSelection(selection.name, mode)}>
        {modeLabels[mode]}
      </Button>
    ))}
    <Button variant="tertiary" size="sm" aria-label={`${SELECTION_NAMES_TEXT.remove} ${selection.name}`} onClick={() => deleteSavedSelection(selection.name)}>{SELECTION_NAMES_TEXT.remove}</Button>
  </>
);

export { SavedRow };
