/* @layer renderer-app @kind component */
import { Box, Stack, VirtualList } from '@drizztdourden08/tessera';
import { stateOf } from '../behavior/state-of';
import { VIRTUAL_LIST_MIN } from '../SpritesPanel.constants';
import type { SpriteViewProps } from '../SpritesPanel.type';
import { ListHeader } from './ListHeader';
import { SpriteRow } from './SpriteRow';

const SpriteList = ({ model, affected, dragFor, handlersFor }: SpriteViewProps) => {
  const row = (fact: SpriteViewProps['model']['shown'][number]) => (
    <SpriteRow
      key={fact.sprite.id}
      fact={fact}
      artwork={model.artwork}
      state={stateOf(model, fact, affected)}
      drag={dragFor(fact.sprite.id)}
      handlers={handlersFor(fact.sprite.id)}
    />
  );
  if (model.shown.length >= VIRTUAL_LIST_MIN) {
    return (
      <Stack gap="2xs" className="sprites-panel__list">
        <ListHeader />
        <Box className="sprites-panel__virtual">
          <VirtualList label="Sprites" items={model.shown} getKey={(fact) => fact.sprite.id} renderItem={row} />
        </Box>
      </Stack>
    );
  }
  return (
    <Stack gap="2xs" role="group" aria-label="Sprites" className="sprites-panel__list">
      <ListHeader />
      {model.shown.map(row)}
    </Stack>
  );
};

export { SpriteList };
