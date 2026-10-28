/* @layer renderer-app @kind component */
import { Box, Flex, Text } from '@drizztdourden08/tessera';
import type { SwatchStripProps } from './SwatchStrip.type';
import './SwatchStrip.css';

const SwatchStrip = ({ colours, size = 'sm', label, captions }: SwatchStripProps) => (
  <Flex className={`swatch-strip swatch-strip--${size}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
    {colours.map((colour, at) => (
      <Flex key={`${colour}-${at}`} direction="column" align="center" gap="2xs" className="swatch-strip__step">
        <Box className={colour === '' ? 'swatch-strip__cell swatch-strip__cell--clear' : 'swatch-strip__cell'} style={colour === '' ? undefined : { backgroundColor: colour }} />
        {captions?.[at] !== undefined && (
          <Text variant="caption" tone="muted" className="swatch-strip__caption">
            {captions[at]}
          </Text>
        )}
      </Flex>
    ))}
  </Flex>
);

export { SwatchStrip };
