/* @layer core @kind logic */

const channelOf = (rgb: number, channel: number): number => (rgb >> (16 - 8 * channel)) & 255;

export { channelOf };
