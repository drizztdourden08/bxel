/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';
import { SUBJECT_HEADER, SUBJECT_PARAM_KEYS } from '../asset-config/subject-header.constants';

export default defineScreens({
  buckets: [
    { id: 'project', title: 'Project', icon: 'folder', menu: 'entry', switcher: false, nav: 'rail', groups: [{ id: 'project-settings', label: 'Project settings' }] },
    { id: 'properties', title: 'Properties', icon: 'sliders-horizontal', menu: 'entry', switcher: false, header: SUBJECT_HEADER, params: SUBJECT_PARAM_KEYS },
    { id: 'options', title: 'Options', icon: 'settings', menu: 'hidden', switcher: false },
  ],
  home: 'project',
  settings: { bucket: 'options', page: 'general' },
  aliases: { asset: 'properties', app: 'options' },
});
