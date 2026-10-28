/* @layer renderer-app @kind component */
import { Card, EmptyState, Grid, ListItemList, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { PALETTE_TEXT } from '../../editor/palette-text.constants';
import { usePaletteCard } from './behavior/usePaletteCard';
import { PALETTE_CARD_TEXT, SWATCH_COLUMN_WIDTH } from './PaletteCard.constants';
import { SwatchTile } from './sub-components/SwatchTile';
import { UserRow } from './sub-components/UserRow';
import './PaletteCard.css';

const PaletteCard = () => {
  const model = usePaletteCard();
  if (!model) return <EmptyState message={PALETTE_CARD_TEXT.missing} />;
  const { bank, slots, users, open } = model;
  return (
    <ScrollArea axis="y" scrollbar="slim" className="palette-card" role="region" aria-label={PALETTE_CARD_TEXT.region}>
      <Stack gap="md" className="palette-card__body">
        <Card title={PALETTE_TEXT.title(bank.name)} subtitle={PALETTE_TEXT.count(bank.cap, bank.transparent)}>
          <Stack gap="sm">
            <Grid minColWidth={SWATCH_COLUMN_WIDTH} gap="2xs" role="group" aria-label={PALETTE_CARD_TEXT.swatches}>
              {slots.map((slot) => (
                <SwatchTile key={slot.index} slot={slot} />
              ))}
            </Grid>
            <Text variant="caption" tone="muted">
              {PALETTE_CARD_TEXT.copyHint}
            </Text>
          </Stack>
        </Card>
        <Card title={PALETTE_CARD_TEXT.users} count={users.length}>
          {users.length === 0 ? (
            <Text variant="caption" tone="muted">
              {PALETTE_CARD_TEXT.noUsers}
            </Text>
          ) : (
            <ListItemList label={PALETTE_CARD_TEXT.users}>
              {users.map((user) => (
                <UserRow key={user.id} user={user} onOpen={open} />
              ))}
            </ListItemList>
          )}
        </Card>
      </Stack>
    </ScrollArea>
  );
};

export { PaletteCard };
