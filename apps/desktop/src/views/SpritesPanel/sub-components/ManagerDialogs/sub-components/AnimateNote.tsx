/* @layer renderer-app @kind component */
import { Callout, Text } from '@drizztdourden08/tessera';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import type { AnimateNoteProps } from '../../../../../sheet-manager/dialog-form.type';

const AnimateNote = ({ plan }: AnimateNoteProps) => {
  if (plan.blocker !== null) return <Callout tone="danger">{plan.blocker}</Callout>;
  if (plan.mixed) return <Callout tone="warning">{COMPOSE_TEXT.padded(plan.width, plan.height)}</Callout>;
  return <Text tone="dim">{COMPOSE_TEXT.sameSize(plan.frames, plan.width, plan.height)}</Text>;
};

export { AnimateNote };
