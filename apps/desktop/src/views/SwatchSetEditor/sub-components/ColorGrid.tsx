/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { colorEntries } from '../../../swatch-library/color-entries';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';
import { ColorCell } from './ColorCell';

const ColorGrid = ({ model }: SetBarProps) => {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const open = (at: number): void => {
    model.pick(at);
    setOpenAt(openAt === at ? null : at);
  };
  return (
    <Flex gap="xs" wrap align="center" role="group" aria-label={SWATCH_EDITOR_TEXT.colorsTitle}>
      {colorEntries(model.current).map((entry) => (
        <ColorCell
          key={entry.id}
          rgb={entry.color.rgb}
          label={SWATCH_EDITOR_TEXT.colorLabel(entry.at, entry.color.rgb)}
          selected={entry.at === model.index}
          open={openAt === entry.at}
          onOpen={() => open(entry.at)}
          onClose={() => setOpenAt(null)}
          onChange={model.recolor}
        />
      ))}
      <IconButton label={SWATCH_EDITOR_TEXT.addColor} size="sm" variant="secondary" onClick={model.addColor}>
        <Icon name="plus" />
      </IconButton>
    </Flex>
  );
};

export { ColorGrid };
