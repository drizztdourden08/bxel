/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import { PREVIEW_NAMES } from '../../../../../sheet-manager/compose.constants';
import type { PieceNamesProps } from '../../../../../sheet-manager/dialog-form.type';

const PieceNames = ({ plan }: PieceNamesProps) => (
  <Stack gap="2xs" aria-live="polite">
    <Text variant="label">{COMPOSE_TEXT.previewNames}</Text>
    {[...new Set(plan.names)].slice(0, PREVIEW_NAMES).map((name) => (
      <Text key={name} variant="caption">
        {name}
      </Text>
    ))}
    {plan.names.length > PREVIEW_NAMES && (
      <Text variant="caption" tone="dim">
        {COMPOSE_TEXT.more(plan.names.length - PREVIEW_NAMES)}
      </Text>
    )}
    {plan.error !== null && <Callout tone="danger">{plan.error}</Callout>}
  </Stack>
);

export { PieceNames };
