/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { dropImageFiles } from './drop-image-files';

const addImageFiles = async (files: readonly File[], at: number, earlier: readonly string[] = []): Promise<readonly string[]> => {
  const reasons = [...earlier, ...(await dropImageFiles(files, at))];
  if (reasons.length > 0) toast(reasons.join(' '), { variant: 'warning' });
  return reasons;
};

export { addImageFiles };
