export function Avatar({
  url,
  alt,
  className,
}: {
  url?: string | null;
  alt?: string | null;
  className: string;
}) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={url} alt={alt || ""} />;
  }
  return (
    <span className={`${className} avatar-fallback`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4.5 20c1.2-3.8 4.2-6 7.5-6s6.3 2.2 7.5 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
