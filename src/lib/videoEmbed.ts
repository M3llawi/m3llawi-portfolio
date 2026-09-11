/** Converts a YouTube/Vimeo watch URL into its embeddable iframe URL. Falls back to the raw URL. */
export function toEmbedUrl(url: string): string {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return url;
}
