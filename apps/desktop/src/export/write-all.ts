/* @layer renderer-app @kind logic */
import { reasonOf } from '../files/reason-of';
import type { ExportResult, ExportSink, MadeEntry } from './export.type';
import { joinPath } from './join-path';

const writeAll = async (sink: ExportSink, folder: string, made: readonly MadeEntry[]): Promise<ExportResult> => {
  let written = 0;
  for (const { file, data } of made) {
    const path = joinPath(folder, file.name);
    try {
      await (data.kind === 'bytes' ? sink.writeBytes(path, data.bytes) : sink.writeText(path, data.text));
    } catch (error) {
      return { kind: 'failed', message: reasonOf(error), written };
    }
    written += 1;
  }
  return { kind: 'done', count: written };
};

export { writeAll };
