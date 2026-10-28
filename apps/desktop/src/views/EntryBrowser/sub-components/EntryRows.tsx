/* @layer renderer-app @kind component */
import { Flex, Icon, Pressable, Text, VirtualList } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { entryId, entryName } from '../../../sheet-manager/entry-id';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { pickHow } from '../../../sheet/pick-how';
import { EntryThumb } from '../../EntryTile';
import { BROWSER_TEXT, BROWSER_THUMB } from '../EntryBrowser.constants';
import type { BrowserBodyProps } from '../EntryBrowser.type';

const metaOf = (fact: EntryFacts): string =>
  fact.kind === 'sprite' ? BROWSER_TEXT.row(fact.sprite.width, fact.sprite.height) : `${fact.frames === 1 ? '1 frame' : `${fact.frames} frames`}`;

const EntryRows = ({ label, artwork, shown, picked, pick, activate, draggable, dragFor }: BrowserBodyProps) => {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <VirtualList
      label={label}
      items={shown}
      getKey={entryId}
      rowHeight="size-40"
      renderItem={(fact) => {
        const key = entryId(fact);
        const drag = dragFor(key);
        const chosen = picked.includes(key);
        return (
          <Pressable
            type="button"
            className={`entry-browser__row${chosen ? ' entry-browser__row--picked' : ''}`}
            aria-pressed={chosen}
            draggable={draggable}
            onClick={(event) => pick(key, pickHow(event) ?? 'replace')}
            onDoubleClick={() => activate(key)}
            onPointerEnter={() => setHot(key)}
            onPointerLeave={() => setHot(null)}
            onDragStart={drag.onDragStart}
            onDragEnd={drag.onDragEnd}
          >
            <Flex gap="xs" align="center">
              <EntryThumb artwork={artwork} fact={fact} box={BROWSER_THUMB} playing={hot === key} />
              <Text as="span" variant="caption" className="entry-browser__row-name">
                {entryName(fact)}
              </Text>
              <Text as="span" variant="caption" tone="dim" className="entry-browser__row-meta">
                {fact.kind === 'animation' && <Icon name="pixel-animation" size={12} />}
                {metaOf(fact)}
              </Text>
            </Flex>
          </Pressable>
        );
      }}
    />
  );
};

export { EntryRows };
