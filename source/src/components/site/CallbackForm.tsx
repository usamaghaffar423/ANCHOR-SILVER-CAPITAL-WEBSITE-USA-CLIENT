import { useState, type FormEvent } from "react";
import { buttonStyles } from "./ui";

const field =
  "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

export function CallbackForm({
  variant = "full",
  submitLabel = "Request a Callback",
}: {
  variant?: "full" | "simple" | "quote";
  submitLabel?: string;
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // Placeholder submission target — wire to an email service or webhook.
    console.info("Anchor Silver Capital lead", data);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-md border border-primary bg-sage-soft p-6">
        <h3 className="text-xl">Thank you. We have your request.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A specialist will call you at the time you selected. If you would rather speak now, call{" "}
          <a className="font-semibold text-primary underline" href="tel:+18668187243">
            (866) 818-7243
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-label="Request a callback">
      <div>
        <label className={label} htmlFor="name">
          Full name
        </label>
        <input className={field} id="name" name="name" required autoComplete="name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="phone">
            Phone number
          </label>
          <input className={field} id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            className={field}
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {variant !== "simple" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="besttime">
              Best time to call
            </label>
            <select className={field} id="besttime" name="besttime" defaultValue="Morning">
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="amount">
              Approximate amount available
            </label>
            <select className={field} id="amount" name="amount" defaultValue="$25,000 – $50,000">
              <option>Under $10,000</option>
              <option>$10,000 – $25,000</option>
              <option>$25,000 – $50,000</option>
              <option>$50,000 – $100,000</option>
              <option>$100,000 – $250,000</option>
              <option>$250,000+</option>
            </select>
          </div>
        </div>
      )}

      {variant === "quote" && (
        <div>
          <label className={label} htmlFor="product">
            Product interest
          </label>
          <select className={field} id="product" name="product" defaultValue="American Silver Eagles">
            <option>American Silver Eagles</option>
            <option>Morgan Silver Dollars</option>
            <option>Peace Silver Dollars</option>
            <option>Canadian Maple Leafs</option>
            <option>10 oz Silver Bars</option>
            <option>100 oz Silver Bars</option>
            <option>Junk Silver (pre-1964 US coins)</option>
            <option>Generic Silver Rounds</option>
            <option>Not sure yet</option>
          </select>
        </div>
      )}

      {variant === "full" && (
        <>
          <fieldset>
            <legend className={label}>I am interested in</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              {["Silver IRA", "Physical Silver", "Just Learning"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="checkbox" name="interest" value={opt} className="accent-primary" />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className={label} htmlFor="source">
              How did you hear about us?
            </label>
            <input className={field} id="source" name="source" />
          </div>
        </>
      )}

      <div>
        <label className={label} htmlFor="message">
          Message (optional)
        </label>
        <textarea className={field} id="message" name="message" rows={4} />
      </div>

      <button type="submit" className={`${buttonStyles.primary} w-full`}>
        {submitLabel}
      </button>
      <p className="text-xs italic text-muted-foreground">
        We use your information only to contact you about precious metals. No obligation, and no
        cost for a consultation.
      </p>
    </form>
  );
}
