/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { folderPath } from '../../../sheet-manager/folder-path';
import type { EntryNameProps } from '../EntryTile.type';

const EntryName = ({ name }: EntryNameProps) => {
  const folder = folderPath(name);
  const tail = folder === '' ? name : name.slice(folder.length + 1);
  return (
    <Text as="span" variant="caption" className="entry-tile__name" title={name}>
      {folder !== '' && <span className="entry-tile__folder">{`${folder}/`}</span>}
      {tail}
    </Text>
  );
};

export { EntryName };
