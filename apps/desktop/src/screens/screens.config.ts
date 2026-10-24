/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'asset', title: 'Asset', icon: 'image', menu: 'hidden' },
    { id: 'project', title: 'Project', icon: 'folder', menu: 'hidden' },
    { id: 'app', title: 'App', icon: 'settings', menu: 'entry' },
  ],
  home: 'app',
  settings: { bucket: 'app', page: 'general' },
});
