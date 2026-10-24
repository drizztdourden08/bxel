/* @layer renderer-app @kind component */
import { defineToolbar } from '@drizztdourden08/brock-react';
import { OPTIONS_TEXT, OptionsToolbar } from '../views/OptionsToolbar';

export default defineToolbar({
  id: 'options',
  label: OPTIONS_TEXT.region,
  defaultSide: 'top',
  render: (slot) => <OptionsToolbar slot={slot} />,
});
