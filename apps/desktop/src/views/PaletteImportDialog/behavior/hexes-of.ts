/* @layer renderer-app @kind logic */
import type { SourceColor } from '../../../palette-source/palette-source.type';

const hexesOf = (colours: readonly SourceColor[]): string[] => colours.map((colour) => colour.rgb);

export { hexesOf };
