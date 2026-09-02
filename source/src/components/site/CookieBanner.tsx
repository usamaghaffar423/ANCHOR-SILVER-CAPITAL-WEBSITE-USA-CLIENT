import { useEffect, useState } from "react";
import { buttonStyles } from "./ui";

const KEY = "asc-cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  if (!show) return null;

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked */
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-silver/20 bg-ink px-5 py-4 text-silver"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed">
          We use cookies to measure site performance and improve your experience. You can decline
          non-essential cookies at any time. See our Privacy Policy for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button className={`${buttonStyles.outlineLight} py-2 text-xs`} onClick={() => decide("declined")}>
            Decline
          </button>
          <button className={`${buttonStyles.silver} py-2 text-xs`} onClick={() => decide("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
