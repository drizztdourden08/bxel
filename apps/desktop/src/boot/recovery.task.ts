/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { recoveryService } from '../recovery/recovery-service';

export default defineBootTask({
  label: 'Watching for unsaved work',
  run: ({ report }) => {
    recoveryService.start();
    report(1, 'Ready');
  },
});
