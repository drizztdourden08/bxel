/* @layer core @kind constants */

const PNG_COLOR_RULES: Readonly<
  Record<number, { readonly channels: number; readonly depths: readonly number[] }>
> = {
  0: { channels: 1, depths: [1, 2, 4, 8, 16] },
  2: { channels: 3, depths: [8, 16] },
  3: { channels: 1, depths: [1, 2, 4, 8] },
  4: { channels: 2, depths: [8, 16] },
  6: { channels: 4, depths: [8, 16] },
};

export { PNG_COLOR_RULES };
