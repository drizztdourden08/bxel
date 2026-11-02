/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'project', title: 'Project', icon: 'folder', menu: 'entry', switcher: false, nav: 'rail', groups: [{ id: 'project-settings', label: 'Project settings' }] },
    { id: 'properties', title: 'Properties', icon: 'sliders-horizontal', menu: 'entry', switcher: false, params: ['subject', 'pin'] },
    { id: 'options', title: 'Options', icon: 'settings', menu: 'hidden', switcher: false },
  ],
  home: 'project',
  settings: { bucket: 'options', page: 'general' },
  aliases: { asset: 'properties', app: 'options' },
});
