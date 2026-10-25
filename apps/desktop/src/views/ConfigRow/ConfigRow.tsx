/* @layer renderer-app @kind component */
import { Box, Flex, Stack } from '@drizztdourden08/tessera';
import { rowTextOf } from '../../config-source/row-text-of';
import { BLOCK_FIELDS } from './ConfigRow.constants';
import type { ConfigRowProps } from './ConfigRow.type';
import { RowHeading } from './sub-components/RowHeading';
import './ConfigRow.css';

const ConfigRow = ({ field, children }: ConfigRowProps) => {
  const text = rowTextOf(field);
  if (text === null) return children;
  if (BLOCK_FIELDS.includes(field)) {
    return (
      <Stack gap="sm" className="config-row">
        <RowHeading text={text} />
        {children}
      </Stack>
    );
  }
  return (
    <Flex gap="xl" align="center" justify="between" wrap className="config-row">
      <RowHeading text={text} />
      <Box className="config-row__control">{children}</Box>
    </Flex>
  );
};

export { ConfigRow };
