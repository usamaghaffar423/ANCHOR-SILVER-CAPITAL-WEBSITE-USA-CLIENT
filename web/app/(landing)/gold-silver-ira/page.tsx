import type { Metadata } from "next";
import { LeadCapture } from "./LeadCapture";

export const metadata: Metadata = {
  title: "Anchor Silver Capital Precious Metals IRA",
  description:
    "Free Precious Metals IRA Handbook from Anchor Silver Capital. Gold and silver IRA, explained plainly.",
};

export default function GoldSilverIraPage() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="bar">
            <div className="brand">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="5" r="2.2" />
                <path d="M12 7.2V21M7.5 11.5h9M4 14c0 4 3.5 7 8 7s8-3 8-7" />
              </svg>
              Anchor Silver Capital
            </div>
            <div className="callnow">
              Prefer to talk?{" "}
              <a href="tel:+18668187243" data-call="">
                (866) 818-7243
              </a>
            </div>
          </div>
          <div className="hero-grid">
            <div>
              <div className="eyebrow" style={{ color: "var(--gold-fill)" }}>
                Gold and silver IRA
              </div>
              <h1>Move retirement savings into real gold and silver.</h1>
              <p className="lead">
                Get the free handbook, then talk it through with a specialist. A direct transfer is
                generally not taxed or penalized, and your metal is held in your name at an approved
                depository.
              </p>
              <ul className="points">
                <li>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="var(--gold-fill)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6.5 10.3l2.4 2.4 4.6-5" />
                  </svg>
                  <span>Gold, silver, or both, from a 401(k), IRA, 403(b), or annuity</span>
                </li>
                <li>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="var(--gold-fill)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6.5 10.3l2.4 2.4 4.6-5" />
                  </svg>
                  <span>Every cost quoted in writing before you commit</span>
                </li>
                <li>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="var(--gold-fill)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="10" cy="10" r="8" />
                    <path d="M6.5 10.3l2.4 2.4 4.6-5" />
                  </svg>
                  <span>A free, no-obligation consultation with a real person</span>
                </li>
              </ul>
              <div className="hb">
                <img
                  src="/images/ira-handbook-cover.jpg"
                  alt="Cover of The Precious Metals IRA Handbook"
                  width={420}
                  height={544}
                />
                <p>
                  <strong>The Precious Metals IRA Handbook</strong>What qualifies, how a transfer
                  works, what it costs, and nine mistakes to avoid. Free.
                </p>
              </div>
            </div>

            <div className="card" id="handbook">
              <LeadCapture />
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">The basics</div>
              <h2>A precious metals IRA is an ordinary IRA with an unusual asset inside it.</h2>
              <p>
                There is no separate tax category for a gold or silver IRA. It follows the same
                contribution, distribution, and tax rules as any IRA. The difference is that it
                holds physical gold and silver bullion instead of funds, so it needs a self-directed
                custodian and an approved depository.
              </p>
            </div>
            <ol className="steps">
              <li>
                <h3>Find out what you have</h3>
                <p>
                  Ask your plan administrator for your balance and whether a direct
                  trustee-to-trustee transfer is available.
                </p>
              </li>
              <li>
                <h3>Free consultation</h3>
                <p>
                  A short conversation about where your money sits and what you want to protect. We
                  tell you honestly whether this fits.
                </p>
              </li>
              <li>
                <h3>Open the account</h3>
                <p>
                  You open a self-directed IRA with American Estate &amp; Trust. The custodian
                  coordinates the transfer with your current provider, usually in a few weeks.
                </p>
              </li>
              <li>
                <h3>Choose your metal</h3>
                <p>
                  You get a written proposal with products, quantities, and the all-in cost. When
                  you approve, the custodian buys it and it ships to the depository in your name.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Eligible metal</div>
              <h2>What the IRS permits you to hold.</h2>
              <p>
                Metal must meet a minimum purity and be held by the trustee, not at home.
                Collectible and rare coins generally do not qualify, however they are marketed.
              </p>
            </div>
            <div className="tablebox">
              <table>
                <thead>
                  <tr>
                    <th>Metal</th>
                    <th>Minimum fineness</th>
                    <th>Common qualifying products</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Gold</strong>
                    </td>
                    <td>.995 (American Gold Eagle qualifies by statute)</td>
                    <td>
                      American Gold Eagle, American Gold Buffalo, Canadian Gold Maple Leaf, approved
                      refiner bars
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Silver</strong>
                    </td>
                    <td>.999</td>
                    <td>
                      American Silver Eagle, Canadian Silver Maple Leaf, Australian Silver
                      Kangaroo, approved refiner bars
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="fine">
              Based on the Internal Revenue Code. Rules change and exceptions exist. Confirm your
              situation with a tax professional.
            </p>
          </div>
        </section>

        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Transfer or rollover</div>
              <h2>The difference that decides whether you owe tax.</h2>
              <p>The two terms get used as if they mean the same thing. They do not.</p>
            </div>
            <div className="two">
              <div className="box dark">
                <div className="tag">The safe route</div>
                <h3>Direct transfer</h3>
                <ul>
                  <li>Money moves custodian to custodian and never touches your hands</li>
                  <li>Generally not treated as a distribution</li>
                  <li>No deadline, no withholding, no frequency limit</li>
                </ul>
              </div>
              <div className="box">
                <div className="tag" style={{ color: "var(--warn)" }}>
                  The route with traps
                </div>
                <h3>Indirect rollover</h3>
                <ul>
                  <li>A check is made out to you and a 60-day clock starts</li>
                  <li>Employer plans generally withhold 20%</li>
                  <li>Only one IRA-to-IRA rollover per 12 months</li>
                </ul>
              </div>
            </div>
            <p className="fine">We recommend a direct transfer unless there is a specific reason not to.</p>
          </div>
        </section>

        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">What it costs</div>
              <h2>Four costs. All of them in writing.</h2>
              <p>
                Any dealer unwilling to itemize every cost before you commit is telling you
                something important.
              </p>
            </div>
            <div className="costs">
              <div className="box">
                <h3>Account setup</h3>
                <p>One time, when the account is opened.</p>
                <div className="who">Custodian</div>
              </div>
              <div className="box">
                <h3>Annual custodian fee</h3>
                <p>Yearly, for administration and IRS reporting.</p>
                <div className="who">Custodian</div>
              </div>
              <div className="box">
                <h3>Storage and insurance</h3>
                <p>Annual, usually based on the value of the metal.</p>
                <div className="who">Depository</div>
              </div>
              <div className="box dark">
                <h3>Dealer premium</h3>
                <p>
                  What you pay above spot. Capped at 15% over spot, all in, quoted in writing
                  before you commit.
                </p>
                <div className="who">Dealer</div>
              </div>
            </div>
            <div
              className="chart"
              role="img"
              aria-label="Premium on a 100,000 dollar purchase: up to 15,000 dollars with Anchor Silver Capital, versus 35,000 to 65,000 dollars at the 35 to 65 percent many dealers take."
            >
              <h3>What the premium costs on a $100,000 purchase</h3>
              <p className="note">Simple arithmetic for illustration. Your actual quote is given in writing.</p>
              <div className="bars">
                <div className="row">
                  <span>
                    Anchor Silver Capital
                    <br />
                    capped at 15%
                  </span>
                  <div className="track">
                    <div className="fill a" style={{ width: "23%", minWidth: "96px" }}>
                      up to $15,000
                    </div>
                  </div>
                </div>
                <div className="row">
                  <span>
                    Many dealers
                    <br />
                    take 35 to 65%
                  </span>
                  <div className="track">
                    <div className="fill b" style={{ width: "54%" }}>
                      $35,000
                    </div>
                    <div className="fill c" style={{ left: "54%", width: "46%" }}>
                      to $65,000
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="callout">
              <strong>Ask any dealer for these in writing.</strong>The spot price right now, the
              all-in price per ounce, the difference between the two as a percentage, and the
              stamped fineness of every product.
            </div>
          </div>
        </section>

        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Who does what</div>
              <h2>Three separate parties, on purpose.</h2>
              <p>No single party controls both the metal and the record of it.</p>
            </div>
            <div className="who3">
              <div className="box">
                <div className="tag">Custodian</div>
                <h3>American Estate &amp; Trust</h3>
                <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: ".95rem" }}>
                  Holds the account, processes your instructions, files the IRS reporting, and
                  coordinates the transfer. It does not give advice or vet a dealer.
                </p>
              </div>
              <div className="box">
                <div className="tag">Depository</div>
                <h3>IDS of Delaware</h3>
                <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: ".95rem" }}>
                  Receives, verifies, stores, and insures the metal, and reports holdings to the
                  custodian. Your metal is never kept at home.
                </p>
              </div>
              <div className="box">
                <div className="tag">Dealer</div>
                <h3>Anchor Silver Capital</h3>
                <p style={{ marginTop: "8px", color: "var(--muted)", fontSize: ".95rem" }}>
                  Sources the metal, quotes the price in writing, ships to the depository in your
                  name, and explains the process.
                </p>
              </div>
            </div>
            <p className="fine">
              American Estate &amp; Trust and IDS of Delaware are independent companies, not owned
              or controlled by Anchor Silver Capital.
            </p>
          </div>
        </section>

        <section className="s">
          <div className="wrap">
            <div className="head">
              <div className="eyebrow">Common questions</div>
              <h2>Answers before you call.</h2>
            </div>
            <div className="faq">
              <details>
                <summary>Can I hold gold and silver in the same IRA?</summary>
                <p>
                  Yes. Both are eligible, and many people hold both. They behave differently in
                  price, volatility, and premium, so the mix is your decision with your own
                  advisors.
                </p>
              </details>
              <details>
                <summary>Do I have to move my whole account?</summary>
                <p>
                  No. A partial transfer leaves your existing account open and moves only the
                  portion you choose, in any proportion. We are not licensed to tell you what share
                  belongs in metal, and most people treat it as one part of a broader portfolio.
                </p>
              </details>
              <details>
                <summary>Can I keep the metal at home?</summary>
                <p>
                  Not inside an IRA. The tax code requires the trustee to hold it, so it is stored
                  at an approved depository. Metal you want in your own hands is bought outside an
                  IRA, without the IRA&apos;s tax treatment.
                </p>
              </details>
              <details>
                <summary>What are the minimums?</summary>
                <p>
                  IRA rollovers typically start at $25,000. Cash purchases for delivery to you
                  start at $10,000.
                </p>
              </details>
              <details>
                <summary>How long does a transfer take?</summary>
                <p>
                  Typically two to three weeks, depending on your current provider. The custodian
                  coordinates it and you receive updates.
                </p>
              </details>
              <details>
                <summary>Is the consultation really free?</summary>
                <p>
                  Yes. It is free and carries no obligation. We will tell you honestly whether a
                  precious metals IRA fits your situation, including when it does not.
                </p>
              </details>
              <details>
                <summary>Is this tax advice?</summary>
                <p>
                  No. We are a precious metals dealer, not a tax advisor or investment advisor.
                  Confirm the treatment of your situation with a qualified tax professional before
                  you move retirement money.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="wrap">
            <h2>Get the handbook, then decide.</h2>
            <p>Read it first. Talk to a specialist when you are ready.</p>
            <a className="btn" href="#handbook">
              Send me the free handbook
            </a>
            <p className="tel">
              Or call{" "}
              <a
                href="tel:+18668187243"
                data-call=""
                style={{
                  color: "var(--hero-ink)",
                  fontWeight: "600",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                (866) 818-7243
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <p>
            <strong>Anchor Silver Capital LLC</strong> · 475 Washington Blvd, Marina del Rey, CA
            90292 · info@anchorsilvercapital.com · (866) 818-7243
          </p>
          <p>
            Anchor Silver Capital is a precious metals dealer, not a registered investment advisor,
            broker-dealer, or tax advisor. Nothing on this page is investment, tax, or legal
            advice. Gold and silver are volatile, pay no interest or dividends, and can lose value.
            Physical precious metals are not FDIC insured. Past performance does not guarantee
            future results.
          </p>
          <p>
            <a href="/terms">Terms of Use</a> · <a href="/privacy">Privacy Policy</a> · © Anchor
            Silver Capital LLC
          </p>
        </div>
      </footer>
    </>
  );
}
