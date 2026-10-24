/* @layer renderer-app @kind component */
import { Stack } from '@drizztdourden08/tessera';
import { stateOf } from '../behavior/state-of';
import type { SpriteViewProps } from '../SpritesPanel.type';
import { ListHeader } from './ListHeader';
import { SpriteRow } from './SpriteRow';

const SpriteList = ({ model, affected, dragFor, handlersFor }: SpriteViewProps) => (
  <Stack gap="2xs" role="group" aria-label="Sprites" className="sprites-panel__list">
    <ListHeader />
    {model.shown.map((fact) => (
      <SpriteRow
        key={fact.sprite.id}
        fact={fact}
        artwork={model.artwork}
        state={stateOf(model, fact, affected)}
        drag={dragFor(fact.sprite.id)}
        handlers={handlersFor(fact.sprite.id)}
      />
    ))}
  </Stack>
);

export { SpriteList };
