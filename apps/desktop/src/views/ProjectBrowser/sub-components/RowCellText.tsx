/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import type { RowCellTextProps } from '../ProjectBrowser.type';

const RowCellText = ({ value, suffix }: RowCellTextProps) => (
  <Text as="span" variant="caption" tone="muted" className={`browser-row__cell${suffix === undefined ? '' : ` browser-row__cell--${suffix}`}`}>
    {value}
  </Text>
);

export { RowCellText };
