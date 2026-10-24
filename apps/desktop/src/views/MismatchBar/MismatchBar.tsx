/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { addMissingLayers } from '../../sheet/add-missing-layers';
import { narrowSelection } from '../../sheet/narrow-selection';
import { MISMATCH_TEXT } from '../../sheet/sheet.constants';
import { useMismatch } from './behavior/useMismatch';
import './MismatchBar.css';

const MismatchBar = () => {
  const mismatch = useMismatch();
  if (!mismatch) return null;
  return (
    <Flex wrap gap="md" align="center" role="alert" aria-label={MISMATCH_TEXT.region} className="mismatch-bar">
      <Text as="span" variant="label">{mismatch.text}</Text>
      <Flex gap="sm" align="center" className="mismatch-bar__actions">
        {mismatch.layerGaps.length > 0 && (
          <Button variant="secondary" onClick={() => addMissingLayers(mismatch)}>{MISMATCH_TEXT.addLayer(mismatch.layerGaps.length)}</Button>
        )}
        <Button variant="primary" onClick={() => narrowSelection(mismatch.keep)}>{MISMATCH_TEXT.narrow(mismatch.keep.length)}</Button>
      </Flex>
    </Flex>
  );
};

export { MismatchBar };
