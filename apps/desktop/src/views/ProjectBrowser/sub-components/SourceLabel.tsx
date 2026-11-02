/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useSourceDrop } from '../behavior/useSourceDrop';
import type { SourceLabelProps } from '../ProjectBrowser.type';

const SourceLabel = ({ item, drop }: SourceLabelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const over = useSourceDrop(ref, item.key, drop);
  return (
    <Box ref={ref} className="browser-sources__label" data-over={over}>
      {item.label}
      {item.count !== null && (
        <Text as="span" variant="caption" tone="muted">
          {` ${item.count}`}
        </Text>
      )}
    </Box>
  );
};

export { SourceLabel };
