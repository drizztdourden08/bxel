/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { FILE_NEW_KEY } from '../../../../../panel-browser/project-browser.constants';
import type { RowNameProps } from '../ProjectTree.type';
import { RowEditor } from './RowEditor';
import { RowName } from './RowName';
import './RowLabel.css';

const RowLabel = (props: RowNameProps) => {
  const { item, model } = props;
  const creating = item.key === FILE_NEW_KEY;
  const editing = creating || (model.edit.editing?.kind === 'rename' && model.edit.editing.key === item.key);
  return (
    <Box className="project-label" data-over={model.drag.dropKey === item.key} {...model.drag.dropOn(item)}>
      {editing ? <RowEditor {...props} creating={creating} /> : <RowName {...props} />}
    </Box>
  );
};

export { RowLabel };
