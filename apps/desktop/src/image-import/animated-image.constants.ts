/* @layer renderer-app @kind constants */
const PNG_HEADER_BYTES = 8;

const CHUNK_HEAD_BYTES = 8;

const CHUNK_FRAME_BYTES = 12;

const CHUNK_TYPE = { control: 'acTL', data: 'IDAT' } as const;

const GIF_MAGIC: readonly number[] = [0x47, 0x49, 0x46, 0x38];

export { CHUNK_FRAME_BYTES, CHUNK_HEAD_BYTES, CHUNK_TYPE, GIF_MAGIC, PNG_HEADER_BYTES };
