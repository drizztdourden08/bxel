/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'app', title: 'App', icon: 'settings', menu: 'entry' },
  ],
  home: 'app',
  settings: { bucket: 'app', page: 'general' },
});
