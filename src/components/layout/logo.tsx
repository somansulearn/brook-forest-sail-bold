export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#1e4d4a" />
      <circle cx="32" cy="32" r="26.5" fill="#f4f1eb" />
      <circle cx="32" cy="32" r="24" fill="#1e4d4a" />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fill="#f4f1eb"
        fontFamily="Segoe UI, IBM Plex Sans, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="0.04em"
      >
        SAW
      </text>
    </svg>
  );
}
