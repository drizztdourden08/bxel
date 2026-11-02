/* @layer renderer-app @kind logic */
import { addReferenceImage } from '../reference-image/add-reference-image';
import { useDropLayerStore } from '../stores/useDropLayerStore';
import { useReferenceStore } from '../stores/useReferenceStore';

const placeOfferAsReference = (): boolean => {
  const { offer, hide } = useDropLayerStore.getState();
  hide();
  if (!offer) return false;
  const key = `sprite:${crypto.randomUUID()}`;
  useReferenceStore.getState().settle(key, { state: 'ready', picture: offer.picture });
  return addReferenceImage({ key, name: offer.name }) !== null;
};

export { placeOfferAsReference };
