/* @layer renderer-app @kind component */
import { Grid, Stack, Text } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import type { AffectedSprite } from '../../../palette-change/palette-change.type';

const AffectedTable = ({ affected }: { affected: readonly AffectedSprite[] }) => (
  <Stack gap="2xs" role="table" aria-label={CHANGE_TEXT.sprite}>
    <Grid columns={3} gap="sm" role="row">
      <Text variant="label" role="columnheader">{CHANGE_TEXT.sprite}</Text>
      <Text variant="label" role="columnheader">{CHANGE_TEXT.frames}</Text>
      <Text variant="label" role="columnheader">{CHANGE_TEXT.pixels}</Text>
    </Grid>
    {affected.map((sprite) => (
      <Grid key={sprite.id} columns={3} gap="sm" role="row">
        <Text role="cell">{sprite.name}</Text>
        <Text role="cell">{sprite.frames}</Text>
        <Text role="cell" numeric>{sprite.pixels}</Text>
      </Grid>
    ))}
  </Stack>
);

export { AffectedTable };
