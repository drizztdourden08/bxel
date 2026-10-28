/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentModel } from '../sheet/current-model';
import { runDocument } from '../sheet/run-document';
import { feedSize } from './feed-size';
import type { GuideScope } from './guide.type';
import { persistedGuideScope } from './persisted-guide-scope';
import { snapStep } from './snap-step';

const sheetGuideScope = (): GuideScope | null => {
  const sheet = currentModel()?.model.sheet;
  if (!sheet) return null;
  return persistedGuideScope({
    lines: sheet.guides,
    size: feedSize,
    step: snapStep,
    write: (label, guides) => void runDocument(label, [{ name: COMMAND_NAME.sheetGuides, targets: null, options: { sheet: sheet.id, guides } }]),
  });
};

export { sheetGuideScope };
