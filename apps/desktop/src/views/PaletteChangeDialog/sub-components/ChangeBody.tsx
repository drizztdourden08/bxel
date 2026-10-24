/* @layer renderer-app @kind component */
import type { ChangeBodyProps } from '../PaletteChangeDialog.type';
import { LimitBody } from './LimitBody';
import { SwatchBody } from './SwatchBody';
import { SwitchBody } from './SwitchBody';

const ChangeBody = ({ request, state }: ChangeBodyProps) => {
  if (request.kind === 'limit') return <LimitBody request={request} state={state} />;
  if (request.kind === 'switch') return <SwitchBody request={request} state={state} />;
  return <SwatchBody request={request} state={state} />;
};

export { ChangeBody };
