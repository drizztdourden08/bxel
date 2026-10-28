/* @layer renderer-app @kind component */
import { Button, Callout } from '@drizztdourden08/tessera';
import { mergeInto } from '../behavior/merge-into';
import { sameSwatch } from '../behavior/same-swatch';
import { EDITOR_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const SameNotice = ({ panel }: PanelProps) => {
  const other = sameSwatch(panel.target.bank, panel.editor);
  if (other === null) return null;
  const action = (
    <Button size="xs" variant="secondary" disabled={panel.lock.locked} onClick={() => mergeInto(panel.editor, other)}>
      {EDITOR_TEXT.merge(other)}
    </Button>
  );
  return (
    <Callout tone="warning" variant="footnote" action={action}>
      {EDITOR_TEXT.same(other)}
    </Callout>
  );
};

export { SameNotice };
