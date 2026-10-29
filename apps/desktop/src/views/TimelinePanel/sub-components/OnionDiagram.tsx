/* @layer renderer-app @kind component */
import { Box, Flex, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT } from '../../../timeline/onion.constants';
import { onionCells } from '../behavior/onion-cells';
import { OnionColour } from './OnionColour';

const OnionDiagram = () => {
  const { before, after, on } = useTimelineStore((state) => state.onion);
  return (
    <Flex gap="sm" align="center" justify="center" wrap className="onion-header">
      <OnionColour side="before" />
      <Box className="onion-diagram" role="img" aria-label={ONION_TEXT.strip} data-on={on ? 'yes' : 'no'}>
        {onionCells(before, after).map((cell) => (
          <Box key={cell.key} className="onion-diagram__cell" data-side={cell.side} data-step={cell.step} />
        ))}
      </Box>
      <Text variant="caption" tone="muted">{ONION_TEXT.nowCaption}</Text>
      <OnionColour side="after" />
    </Flex>
  );
};

export { OnionDiagram };
