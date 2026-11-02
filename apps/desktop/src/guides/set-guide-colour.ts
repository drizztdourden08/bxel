/* @layer renderer-app @kind logic */
import { currentViewKey } from '../reference-image/current-view-key';
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { currentGuideColours } from './current-guide-colours';
import { guideColourKey } from './guide-colour-key';
import type { GuideAxis } from './guide.type';

const setGuideColour = (axis: GuideAxis, position: number, colour: string | null): void => {
  const key = currentViewKey();
  if (key === null) return;
  const own = guideColourKey(axis, position);
  const rest = Object.fromEntries(Object.entries(currentGuideColours()).filter(([name]) => name !== own));
  useAssetViewStore.getState().patch(key, { guideColours: colour === null ? rest : { ...rest, [own]: colour } });
};

export { setGuideColour };
