/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { createDefaultProject } from '../documents/create-default-project';
import { useDocumentStore } from '../stores/useDocumentStore';

export default defineBootTask({
  label: 'Creating the first sprite',
  run: ({ report }) => {
    const { host } = useDocumentStore.getState();
    if (host.list().length === 0) createDefaultProject(host);
    report(1, 'Ready');
  },
});
