/* @layer core @kind test */
import type { LoadReport } from '@bxel/document/native';

const firstCode = (report: LoadReport): string | undefined => report.issues[0]?.code;

export { firstCode };
