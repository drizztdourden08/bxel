/* @layer renderer-app @kind logic */
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import { FILE_TEXT } from '../files/files.constants';
import { IMAGE_FILTERS } from '../image-import/image-import.constants';
import { LAYER_TEXT } from './layer-text.constants';

const pickReferencePath = async (): Promise<string | null> => {
  const documents = getPlatform().documents;
  if (!documents) {
    toast(FILE_TEXT.unavailable, { variant: 'info' });
    return null;
  }
  return documents.open({ title: LAYER_TEXT.pickImage, filters: IMAGE_FILTERS });
};

export { pickReferencePath };
