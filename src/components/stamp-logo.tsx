/** Marca do bateCarimbo: um carimbo estilizado (usa currentColor). */
export function StampLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="8" y="3" width="8" height="2.6" rx="1.3" />
      <path d="M10 5.6 8.8 11" />
      <path d="M14 5.6 15.2 11" />
      <rect x="5" y="11" width="14" height="3.8" rx="1.7" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}
