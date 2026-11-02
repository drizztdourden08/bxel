/* @layer renderer-app @kind component */
import { Button, DialogShell, Flex, Text } from '@drizztdourden08/tessera';
import { pasteOfferAsLayer } from '../../canvas-drop/paste-offer-as-layer';
import { placeOfferAsReference } from '../../canvas-drop/place-offer-as-reference';
import { useDropLayerStore } from '../../stores/useDropLayerStore';
import { DROP_LAYER_TEXT } from './DropLayerDialog.constants';

const DropLayerDialog = () => {
  const offer = useDropLayerStore((state) => state.offer);
  const hide = useDropLayerStore((state) => state.hide);
  if (!offer) return null;
  const actions = (
    <Flex gap="sm" wrap>
      <Button variant="tertiary" onClick={hide}>{DROP_LAYER_TEXT.cancel}</Button>
      {offer.picture && <Button variant="secondary" onClick={() => void placeOfferAsReference()}>{DROP_LAYER_TEXT.reference}</Button>}
      <Button variant="primary" onClick={() => void pasteOfferAsLayer()}>{DROP_LAYER_TEXT.layer}</Button>
    </Flex>
  );
  return (
    <DialogShell open title={DROP_LAYER_TEXT.title} onClose={hide} actions={actions}>
      <Text>{DROP_LAYER_TEXT.message(offer.name)}</Text>
    </DialogShell>
  );
};

export { DropLayerDialog };
