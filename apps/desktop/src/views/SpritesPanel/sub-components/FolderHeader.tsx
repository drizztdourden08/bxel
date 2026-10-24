/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, Pressable, Text } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { selectIds } from '../../../sheet-manager/select-ids';
import { useManagerStore } from '../../../stores/useManagerStore';
import { FOLDER_DEPTH_LIMIT } from '../SpritesPanel.constants';
import type { FolderHeaderProps } from '../SpritesPanel.type';

const FolderHeader = ({ group }: FolderHeaderProps) => {
  const toggle = useManagerStore((state) => state.toggleFolder);
  return (
    <Flex align="center" gap="xs" className="sprites-panel__folder" data-depth={Math.min(group.depth, FOLDER_DEPTH_LIMIT)}>
      <Pressable
        type="button"
        className="sprites-panel__folder-toggle"
        aria-expanded={!group.closed}
        aria-label={FOLDER_TEXT.toggle(group.path, group.closed)}
        onClick={() => toggle(group.path)}
      >
        <Icon name={group.closed ? 'chevron-right' : 'chevron-down'} size={14} />
        <Text as="span" variant="caption">
          {group.path}
        </Text>
        <Text as="span" variant="caption" tone="dim">
          {group.facts.length}
        </Text>
      </Pressable>
      <IconButton label={FOLDER_TEXT.select(group.path)} size="xs" onClick={() => selectIds(group.facts.map((fact) => fact.sprite.id))}>
        <Icon name="check" size={14} />
      </IconButton>
    </Flex>
  );
};

export { FolderHeader };
