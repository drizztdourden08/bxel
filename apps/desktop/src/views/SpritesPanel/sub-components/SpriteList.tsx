/* @layer renderer-app @kind component */
import { ScrollArea, Stack } from '@drizztdourden08/tessera';
import { listItems } from '../../../sheet-manager/list-items';
import type { ListItem } from '../../../sheet-manager/folders.type';
import { stateOf } from '../behavior/state-of';
import { HEADER_ROWS, VIRTUAL_LIST_MIN } from '../SpritesPanel.constants';
import type { RowPlace, SpriteViewProps } from '../SpritesPanel.type';
import { FolderHeader } from './FolderHeader';
import { ListHeader } from './ListHeader';
import { SpriteRow } from './SpriteRow';
import { SpriteRows } from './SpriteRows';

const SpriteList = ({ model, affected, dragFor, handlersFor }: SpriteViewProps) => {
  const items = listItems(model.groups);
  const rowOf = (item: ListItem, place?: RowPlace) => {
    if (item.group) return <FolderHeader key={item.key} group={item.group} place={place} />;
    if (!item.fact) return null;
    return (
      <SpriteRow
        key={item.key}
        fact={item.fact}
        artwork={model.artwork}
        state={stateOf(model, item.fact, affected)}
        drag={dragFor(item.fact.sprite.id)}
        handlers={handlersFor(item.fact.sprite.id)}
        place={place}
      />
    );
  };
  if (model.shown.length >= VIRTUAL_LIST_MIN) {
    return (
      <Stack gap="2xs" role="grid" aria-label="Sprites" aria-multiselectable aria-rowcount={items.length + HEADER_ROWS} className="sprites-panel__vlist">
        <ListHeader />
        <SpriteRows items={items} rowOf={rowOf} />
      </Stack>
    );
  }
  return (
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="sprites-panel__scroll">
      <Stack gap="2xs" role="grid" aria-label="Sprites" aria-multiselectable className="sprites-panel__list">
        <ListHeader />
        {items.map((item) => rowOf(item))}
      </Stack>
    </ScrollArea>
  );
};

export { SpriteList };
