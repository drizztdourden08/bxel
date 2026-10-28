/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { TOOLBAR_FLAG } from '../ui-context/widget-context.constants';
import { OPTIONS_TEXT, OptionsToolbar } from '../views/OptionsToolbar';

export default defineToolbar({
  id: 'options',
  label: OPTIONS_TEXT.region,
  defaultSide: 'top',
  when: { when: (ctx) => ctx.flags[TOOLBAR_FLAG.options] !== false },
  render: (slot) => <OptionsToolbar slot={slot} />,
});
