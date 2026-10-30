/**
 * The California "Your Privacy Choices" opt-out icon: a toggle with a check (blue half)
 * and an X (white half). Decorative; the link text carries the meaning.
 */
export function PrivacyChoicesIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 30 14"
      width="30"
      height="14"
      className={className}
    >
      <rect x="0.5" y="0.5" width="29" height="13" rx="6.5" fill="#fff" stroke="#06f" />
      <path d="M0.5 7a6.5 6.5 0 0 1 6.5-6.5h8v13H7A6.5 6.5 0 0 1 0.5 7Z" fill="#06f" />
      <path d="m4.6 7.2 1.9 1.9 3.4-3.9" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m19.2 4.8 4.4 4.4m0-4.4-4.4 4.4" fill="none" stroke="#06f" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
