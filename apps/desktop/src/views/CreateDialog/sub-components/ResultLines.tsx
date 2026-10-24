/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreationSummary } from '../../../new-sprite/new-sprite.type';

const ResultLines = ({ summary }: { summary: CreationSummary }) => (
  <Stack gap="2xs" aria-live="polite">
    <Text variant="label">{NEW_TEXT.result}</Text>
    <Text>{summary.count}</Text>
    <Text variant="caption" tone="muted">
      {summary.usage}
    </Text>
    {summary.fits !== null && (
      <Text variant="caption" tone="muted">
        {summary.fits}
      </Text>
    )}
    {summary.sheet !== null && (
      <Text variant="caption" tone="muted">
        {summary.sheet}
      </Text>
    )}
  </Stack>
);

export { ResultLines };
