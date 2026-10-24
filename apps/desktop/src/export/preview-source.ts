/* @layer renderer-app @kind logic */
import { PREVIEW_MIME } from './export.constants';
import type { ExportPlan } from './export.type';
import { toDataUrl } from './to-data-url';

const previewSource = (plan: ExportPlan | null): string | null => {
  const file = plan?.problem === null ? plan.files[0] : undefined;
  const mime = PREVIEW_MIME[file?.name.split('.').at(-1)?.toLowerCase() ?? ''];
  if (!file || mime === undefined) return null;
  const made = file.make();
  return made.ok && made.data.kind === 'bytes' ? toDataUrl(made.data.bytes, mime) : null;
};

export { previewSource };
