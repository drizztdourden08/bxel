/* @layer renderer-app @kind component */
import { Box, ScrollArea, Stack, VirtualList } from '@drizztdourden08/tessera';
import { listItems } from '../../../sheet-manager/list-items';
import type { ListItem } from '../../../sheet-manager/folders.type';
import { stateOf } from '../behavior/state-of';
import { VIRTUAL_LIST_MIN } from '../SpritesPanel.constants';
import type { SpriteViewProps } from '../SpritesPanel.type';
import { FolderHeader } from './FolderHeader';
import { ListHeader } from './ListHeader';
import { SpriteRow } from './SpriteRow';

const SpriteList = ({ model, affected, dragFor, handlersFor }: SpriteViewProps) => {
  const items = listItems(model.groups);
  const row = (item: ListItem) => {
    if (item.group) return <FolderHeader key={item.key} group={item.group} />;
    if (!item.fact) return null;
    return (
      <SpriteRow
        key={item.key}
        fact={item.fact}
        artwork={model.artwork}
        state={stateOf(model, item.fact, affected)}
        drag={dragFor(item.fact.sprite.id)}
        handlers={handlersFor(item.fact.sprite.id)}
      />
    );
  };
  if (model.shown.length >= VIRTUAL_LIST_MIN) {
    return (
      <Stack gap="2xs" className="sprites-panel__vlist">
        <ListHeader />
        <Box className="sprites-panel__virtual">
          <VirtualList label="Sprites" items={items} getKey={(item) => item.key} renderItem={row} />
        </Box>
      </Stack>
    );
  }
  return (
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="sprites-panel__scroll">
      <Stack gap="2xs" role="group" aria-label="Sprites" className="sprites-panel__list">
        <ListHeader />
        {items.map(row)}
      </Stack>
    </ScrollArea>
  );
};

export { SpriteList };
