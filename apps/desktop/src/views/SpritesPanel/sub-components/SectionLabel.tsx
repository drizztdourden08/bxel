/* @layer renderer-app @kind component */
import { Icon, IconButton, Text } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { selectIds } from '../../../sheet-manager/select-ids';
import type { FolderHeaderProps } from '../SpritesPanel.type';

const SectionLabel = ({ group }: FolderHeaderProps) => {
  const name = group.path === '' ? FOLDER_TEXT.root : group.path;
  return (
    <>
      <Text as="span" variant="caption">
        {name}
      </Text>
      <IconButton
        label={FOLDER_TEXT.select(name)}
        size="xs"
        onClick={(event) => {
          event.stopPropagation();
          selectIds(group.facts.map((fact) => fact.sprite.id));
        }}
      >
        <Icon name="check" size={14} />
      </IconButton>
    </>
  );
};

export { SectionLabel };
