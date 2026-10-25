/* @layer renderer-app @kind logic */
import type { DocumentView } from '../../../documents/document-host.type';
import type { PresetOffer } from '../PresetMoveBar.type';

const canOffer = (view: DocumentView | null, offer: PresetOffer): view is DocumentView =>
  view !== null && !view.state.readOnly && offer.inProject && offer.presets > 0 && !offer.offered.includes(view.state.artwork.id);

export { canOffer };
