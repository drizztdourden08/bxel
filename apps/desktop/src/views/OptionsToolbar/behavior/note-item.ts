/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';

const noteItem = (id: string, caption: string): ToolbarItem => ({
  kind: 'button',
  id,
  label: caption,
  description: OPTIONS_TEXT.noOptions,
  icon: 'info',
  caption,
  disabled: true,
  onSelect: () => undefined,
});

export { noteItem };
