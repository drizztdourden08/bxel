/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import type { MouseEvent } from 'react';
import type { RowLeadProps } from '../ProjectTree.type';
import { RowThumb } from './RowThumb';
import './RowLead.css';

const RowLead = (props: RowLeadProps) => {
  const { item, expanded, model } = props;
  const toggle = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    model.rowActions.toggle(item.key);
  };
  return (
    <>
      <Box className="project-chevron" data-open={expanded === true} onClick={expanded === null ? undefined : toggle}>
        {expanded === null ? null : <Icon name="chevron-right" size={12} />}
      </Box>
      {item.role === 'group' ? null : <RowThumb {...props} />}
    </>
  );
};

export { RowLead };
