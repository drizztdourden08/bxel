/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import type { SourceSectionProps } from '../ProjectBrowser.type';

const SourceSection = ({ title, empty, children }: SourceSectionProps) => (
  <Box className="browser-sources__section">
    <Text as="h3" variant="overline" tone="muted">
      {title}
    </Text>
    {empty !== undefined && (
      <Text as="p" variant="caption" tone="muted" className="browser-sources__empty">
        {empty}
      </Text>
    )}
    {children}
  </Box>
);

export { SourceSection };
