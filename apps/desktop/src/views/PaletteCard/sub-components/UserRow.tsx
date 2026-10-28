/* @layer renderer-app @kind component */
import { Button, Icon, Image, ListItemRow } from '@drizztdourden08/tessera';
import { PALETTE_CARD_TEXT, THUMB_WIDTH } from '../PaletteCard.constants';
import type { PaletteUser } from '../PaletteCard.type';

const UserRow = ({ user, onOpen }: { readonly user: PaletteUser; readonly onOpen: (id: string) => void }) => (
  <ListItemRow
    media={user.thumb === null ? <Icon name="pixel-sprite" /> : <Image src={user.thumb} alt="" fit="contain" pixelated />}
    mediaWidth={THUMB_WIDTH}
    name={user.name}
    meta={user.size}
    action={
      <Button size="sm" variant="ghost" aria-label={PALETTE_CARD_TEXT.openLabel(user.name)} onClick={() => onOpen(user.id)}>
        {PALETTE_CARD_TEXT.open}
      </Button>
    }
    actionVisibility="always"
    onClick={() => onOpen(user.id)}
  />
);

export { UserRow };
