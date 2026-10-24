/* @layer renderer-app @kind component */
import { Tooltip } from '@drizztdourden08/tessera';
import type { ActionHintProps } from './ActionHint.type';
import { HintBody } from './sub-components/HintBody';

const ActionHint = ({ hint, placement = 'bottom', className, children }: ActionHintProps) => (
  <Tooltip content={hint ? <HintBody hint={hint} /> : null} placement={placement} className={className}>
    {children}
  </Tooltip>
);

export { ActionHint };
