/* @layer renderer-app @kind logic */
import { assetsTouched } from '@bxel/document';
import type { Artwork, TransactionRequest } from '@bxel/document';
import type { ToolContext } from '../assistant.type';
import { mentions } from './mentions';

const editTouches = (context: ToolContext, request: TransactionRequest, artwork: Artwork, covered: ReadonlySet<string>): boolean => {
  if (covered.size === 0) return false;
  if (request.steps.some((step) => mentions([step.targets, step.options], covered))) return true;
  const trial = context.host.execute({ ...request, mode: 'preview', previewPixels: 0 });
  return trial.ok && assetsTouched(trial.changes, artwork, artwork).some((key) => covered.has(key.id));
};

export { editTouches };
