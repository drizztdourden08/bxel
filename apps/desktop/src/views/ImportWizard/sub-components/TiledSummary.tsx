/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { TILED_TEXT } from '../../../tiled-import/tiled-import.constants';
import type { TiledSummaryProps } from '../ImportWizard.type';

const TiledSummary = ({ tiled }: TiledSummaryProps) => {
  const { plan } = tiled;
  return (
    <Stack gap="sm">
      <Text tone="muted">{TILED_TEXT.summary(plan.columns, plan.rows, plan.tiles.length, plan.layers.length)}</Text>
      <Text tone="muted">{TILED_TEXT.tileSize(plan.tileWidth, plan.tileHeight)}</Text>
      {plan.warnings.length > 0 && (
        <Callout tone="warning">
          {TILED_TEXT.warnings}: {plan.warnings.join(' ')}
        </Callout>
      )}
    </Stack>
  );
};

export { TiledSummary };
