/* @layer renderer-app @kind component */
import { ColorSwatch, Flex } from '@drizztdourden08/tessera';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerColoursProps } from '../LayerStack.type';
import './LayerColours.css';

/** The colour tags a layer can carry, one click each. The checker swatch takes the tag away. */
const LayerColours = ({ value, label, onPick }: LayerColoursProps) => (
  <Flex gap="2xs" align="center" wrap role="group" aria-label={label} className="layer-colours">
    <ColorSwatch
      size="sm"
      color="transparent"
      transparent
      selected={value === null}
      aria-pressed={value === null}
      aria-label={LAYER_STACK_TEXT.noTag}
      onClick={() => onPick(null)}
    />
    {TAG_COLOUR_CHOICES.map((choice) => (
      <ColorSwatch
        key={choice.hex}
        size="sm"
        color={choice.hex}
        selected={value === choice.hex}
        aria-pressed={value === choice.hex}
        aria-label={LAYER_STACK_TEXT.tagName(choice.name)}
        onClick={() => onPick(choice.hex)}
      />
    ))}
  </Flex>
);

export { LayerColours };
