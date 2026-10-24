/* @layer renderer-app @kind component */
import { findBank } from '@bxel/document';
import { Text } from '@drizztdourden08/tessera';
import { pivotLabel } from '../../../sheet-manager/pivot-label';
import { LIST_THUMB } from '../SpritesPanel.constants';
import type { SpriteItemProps } from '../SpritesPanel.type';
import { SpriteButton } from './SpriteButton';
import { SpriteThumb } from './SpriteThumb';

const SpriteRow = ({ fact, artwork, state, drag, handlers }: SpriteItemProps) => {
  const { sprite } = fact;
  return (
    <SpriteButton fact={fact} base="sprites-panel__row" state={state} drag={drag} handlers={handlers}>
      <SpriteThumb artwork={artwork} sprite={sprite} box={LIST_THUMB} />
      <Text as="span" variant="caption" className="sprites-panel__cell sprites-panel__cell--name">{sprite.name}</Text>
      <Text as="span" variant="caption" numeric className="sprites-panel__cell">{`${sprite.width}x${sprite.height}`}</Text>
      <Text as="span" variant="caption" numeric className="sprites-panel__cell">{pivotLabel(sprite)}</Text>
      <Text as="span" variant="caption" numeric className="sprites-panel__cell">{fact.frames}</Text>
      <Text as="span" variant="caption" numeric className="sprites-panel__cell">{fact.tags}</Text>
      <Text as="span" variant="caption" className="sprites-panel__cell">{findBank(artwork, sprite.bankId)?.name ?? ''}</Text>
    </SpriteButton>
  );
};

export { SpriteRow };
