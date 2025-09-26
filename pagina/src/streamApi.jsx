const DEFAULT_STREAM_BASE =
  import.meta?.env?.VITE_STREAM_BASE || // Vite
  "http://localhost:4000";

export const streamBase = DEFAULT_STREAM_BASE;

export const getStreamUrl = (fileName) =>
  `${streamBase}/stream/${encodeURIComponent(fileName)}`;