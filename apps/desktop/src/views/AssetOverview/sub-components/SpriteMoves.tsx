/* @layer renderer-app @kind component */
import { Button, Flex, Icon } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT, SPRITE_MOVES } from '../../../asset-overview/asset-overview.constants';
import { moveFocused } from '../../../asset-overview/move-focused';
import type { OverviewPartProps } from '../AssetOverview.type';

const SpriteMoves = ({ model }: OverviewPartProps) => (
  <Flex gap="xs" wrap role="group" aria-label={OVERVIEW_TEXT.moves}>
    {SPRITE_MOVES.map((move) => (
      <Button
        key={move.id}
        size="sm"
        variant="secondary"
        disabled={model.focus.readOnly}
        icon={<Icon name={move.icon} flip={move.iconFlip} />}
        onClick={() => moveFocused(model.focus, move)}
      >
        {move.label}
      </Button>
    ))}
  </Flex>
);

export { SpriteMoves };
