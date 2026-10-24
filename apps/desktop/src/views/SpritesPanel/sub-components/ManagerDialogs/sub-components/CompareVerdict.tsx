/* @layer renderer-app @kind component */
import { Callout } from '@drizztdourden08/tessera';
import { IDENTICAL_TEXT } from '../../../../../sheet-manager/identical-text.constants';
import type { CompareVerdictProps } from '../../../../../sheet-manager/dialog-form.type';

const CompareVerdict = ({ comparison, first, second }: CompareVerdictProps) => {
  if (comparison.identical) return <Callout tone="success">{IDENTICAL_TEXT.identical}</Callout>;
  if (comparison.flippedAs !== null) return <Callout tone="info">{IDENTICAL_TEXT.flipped(comparison.flippedAs)}</Callout>;
  if (!comparison.sameSize || comparison.differing === null) {
    return (
      <Callout tone="warning">
        {IDENTICAL_TEXT.sizesDiffer(IDENTICAL_TEXT.sizeLine(first.width, first.height), IDENTICAL_TEXT.sizeLine(second.width, second.height))}
      </Callout>
    );
  }
  return <Callout tone="warning">{IDENTICAL_TEXT.differs(comparison.differing, comparison.total)}</Callout>;
};

export { CompareVerdict };
