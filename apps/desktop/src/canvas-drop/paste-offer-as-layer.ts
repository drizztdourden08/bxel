/* @layer renderer-app @kind logic */
import { pasteInPlace } from '../editor/selection/paste-in-place';
import { prepareFor } from '../editor/selection/prepare-paste';
import { useDropLayerStore } from '../stores/useDropLayerStore';
import { useSelectionStore } from '../stores/useSelectionStore';

const pasteOfferAsLayer = (): boolean => {
  const { offer, hide } = useDropLayerStore.getState();
  hide();
  if (!offer) return false;
  useSelectionStore.getState().setClipboard(offer.clip);
  prepareFor('layer');
  return pasteInPlace();
};

export { pasteOfferAsLayer };
