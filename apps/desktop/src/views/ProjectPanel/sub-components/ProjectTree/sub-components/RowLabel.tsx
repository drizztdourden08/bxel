/* @layer renderer-app @kind component */
import { keepsWidgetFocus } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { FILE_NEW_KEY } from '../../../../../panel-browser/project-browser.constants';
import { useFolderDropTarget } from '../../../behavior/useFolderDropTarget';
import type { RowNameProps } from '../ProjectTree.type';
import { RowEditor } from './RowEditor';
import { RowName } from './RowName';
import './RowLabel.css';

const RowLabel = (props: RowNameProps) => {
  const { item, model } = props;
  const ref = useRef<HTMLDivElement>(null);
  useFolderDropTarget(ref, item, model);
  const creating = item.key === FILE_NEW_KEY;
  const editing = creating || (model.edit.editing?.kind === 'rename' && model.edit.editing.key === item.key);
  return (
    <Box ref={ref} className="project-label" data-over={model.drag.dropKey === item.key} {...keepsWidgetFocus()}>
      {editing ? <RowEditor {...props} creating={creating} /> : <RowName {...props} />}
    </Box>
  );
};

export { RowLabel };
