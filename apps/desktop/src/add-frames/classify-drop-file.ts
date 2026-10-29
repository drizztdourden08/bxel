/* @layer renderer-app @kind logic */
import { fitImage } from './fit-image';
import { DROP_TEXT } from './image-drop.constants';
import type { DropOutcome, DropTarget } from './image-drop.type';
import { planImageDrop } from './plan-image-drop';
import { readDropFile } from './read-drop-file';

const refuse = (name: string, reason: string): DropOutcome => ({ kind: 'refuse', reason: DROP_TEXT.refused(name, reason) });

const classifyDropFile = async (file: File, target: DropTarget): Promise<DropOutcome> => {
  const read = await readDropFile(file);
  if (!read.ok) return { kind: 'refuse', reason: read.reason };
  const { image } = read;
  const plan = planImageDrop(image, target.focus.animation);
  if (plan.kind === 'refuse') return refuse(file.name, plan.reason);
  const fit = fitImage(image, target.bank);
  if (!fit.ok) return refuse(file.name, fit.reason);
  if (plan.kind === 'frame') return { kind: 'frame', pixels: fit.pixels };
  const { width, height, data } = image;
  return { kind: 'strip', strip: { name: file.name, width, height, rgba: data, bankId: target.focus.animation.bankId, at: target.at } };
};

export { classifyDropFile };
