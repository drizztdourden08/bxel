/* @layer renderer-app @kind component */
import { ColorSwatch, Flex } from '@drizztdourden08/tessera';
import { colorEntries } from '../../../swatch-library/color-entries';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';

const ColorGrid = ({ model }: SetBarProps) => (
  <Flex gap="xs" wrap role="group" aria-label={SWATCH_EDITOR_TEXT.colorsTitle}>
    {colorEntries(model.current).map((entry) => (
      <ColorSwatch
        key={entry.id}
        color={entry.color.rgb}
        selected={entry.at === model.index}
        aria-label={SWATCH_EDITOR_TEXT.colorLabel(entry.at, entry.color.rgb)}
        onClick={() => model.pick(entry.at)}
      />
    ))}
  </Flex>
);

export { ColorGrid };
