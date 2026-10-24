/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { bankTable } from '../editor/bank-table';
import { paintIndices } from '../image-import/paint-indices';
import type { ChangePicture, PictureInput } from './palette-change.type';

const changePicture = ({ sprite, bank, frame, removed, other }: PictureInput): ChangePicture | null => {
  const frameId = sprite.frames[frame - 1]?.id;
  if (frameId === undefined) return null;
  const indices = flattenFrame(sprite, frameId);
  const table = bankTable(bank);
  const { width, height } = sprite;
  return {
    spriteName: sprite.name,
    before: { data: paintIndices(indices, table), width, height },
    after: { data: paintIndices(indices.map((index) => (index === removed ? other : index)), table), width, height },
  };
};

export { changePicture };
