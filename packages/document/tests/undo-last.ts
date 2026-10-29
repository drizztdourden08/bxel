/* @layer core @kind test */
import type { Engine, TransactionResult } from '@bxel/document';

const undoLast = (engine: Engine): TransactionResult => engine.undo({ documentId: engine.documentId, expectedRevision: engine.state().revision });

export { undoLast };
