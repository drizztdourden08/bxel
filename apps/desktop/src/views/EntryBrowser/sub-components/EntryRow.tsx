/* @layer renderer-app @kind component */
import { Flex, Icon, Pressable, Text } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useEntryDragSource } from '../../../asset-drag/useEntryDragSource';
import { entryName } from '../../../sheet-manager/entry-name';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { pickHow } from '../../../sheet/pick-how';
import { EntryThumb } from '../../EntryTile';
import { BROWSER_TEXT, BROWSER_THUMB } from '../EntryBrowser.constants';
import type { EntryRowProps } from '../EntryBrowser.type';

const metaOf = (fact: EntryFacts): string =>
  fact.kind === 'sprite' ? BROWSER_TEXT.row(fact.sprite.width, fact.sprite.height) : `${fact.frames === 1 ? '1 frame' : `${fact.frames} frames`}`;

const EntryRow = ({ fact, artwork, chosen, hot, drag, onPick, onActivate, onHot }: EntryRowProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  useEntryDragSource(ref, drag);
  return (
    <Pressable
      ref={ref}
      type="button"
      className={`entry-browser__row${chosen ? ' entry-browser__row--picked' : ''}`}
      aria-pressed={chosen}
      onClick={(event) => onPick(pickHow(event) ?? 'replace')}
      onDoubleClick={onActivate}
      onPointerEnter={() => onHot(true)}
      onPointerLeave={() => onHot(false)}
    >
      <Flex gap="xs" align="center">
        <EntryThumb artwork={artwork} fact={fact} box={BROWSER_THUMB} playing={hot} />
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
};

export { EntryRow };
