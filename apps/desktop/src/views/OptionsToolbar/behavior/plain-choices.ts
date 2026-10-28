/* @layer renderer-app @kind logic */
import type { ToolbarChoices } from '@drizztdourden08/tessera';
import { choose, hintChoice } from '../../../toolbar-items';
import { PLAIN_ICONS, plainHint } from '../DrawingOptions.constants';

type PlainKey = keyof typeof PLAIN_ICONS;

type PlainGroup<T extends PlainKey> = {
  readonly id: string;
  readonly label: string;
  readonly values: readonly T[];
  readonly value: T;
  readonly onChange: (value: T) => void;
};

const plainGroup = <T extends PlainKey>({ id, label, values, value, onChange }: PlainGroup<T>): ToolbarChoices => ({
  kind: 'group',
  id,
  label,
  value,
  choices: values.map((each) => hintChoice(each, PLAIN_ICONS[each], plainHint(each))),
  onChange: choose(values, onChange),
});

export { plainGroup };
