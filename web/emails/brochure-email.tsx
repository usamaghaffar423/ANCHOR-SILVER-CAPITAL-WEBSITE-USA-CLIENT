import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Link,
  Hr,
} from "@react-email/components";
import * as React from "react";

/**
 * Auto-sent when a lead submits any form on anchorsilvercapital.com.
 * Rendered by Resend in sendBrochure(): the pipeline injects firstName,
 * the chosen brochure title, and a short-lived signed PDF URL.
 *
 * NOTE: replace the text wordmark with a hosted PNG logo (Gmail strips SVG).
 * Use a real https image URL for <Img>; do not inline SVG.
 */
export type BrochureEmailProps = {
  firstName?: string;
  brochureTitle?: string; // "The Silver Prospectus" | "The Silver IRA Handbook"
  brochureUrl?: string; // signed R2/Blob URL, injected by the pipeline
  phone?: string;
  unsubscribeUrl?: string;
};

export default function BrochureEmail({
  firstName = "there",
  brochureTitle = "The Silver Prospectus",
  brochureUrl = "https://anchorsilvercapital.com/",
  phone = "(866) 818-7243",
  unsubscribeUrl = "{{unsubscribe_url}}",
}: BrochureEmailProps) {
  const telHref = `tel:+1${phone.replace(/[^0-9]/g, "")}`;
  return (
    <Html>
      <Head />
      <Preview>Your guide is inside — plus what happens next. No obligation.</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={wordmark}>ANCHOR&nbsp;SILVER&nbsp;CAPITAL</Text>
          </Section>

          {/* Body */}
          <Section style={main}>
            <Heading style={h1}>Your guide is ready</Heading>
            <Text style={p}>Hi {firstName},</Text>
            <Text style={p}>
              Thanks for requesting <strong>{brochureTitle}</strong>. You can read it
              whenever you&rsquo;re ready — there&rsquo;s no obligation and nothing to sign.
            </Text>

            <Section style={{ textAlign: "center", margin: "30px 0" }}>
              <Button style={button} href={brochureUrl}>
                Read your guide
              </Button>
            </Section>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              What happens next
            </Heading>
            <Text style={li}>A specialist will reach out at the time you chose.</Text>
            <Text style={li}>
              They&rsquo;ll ask where your money sits and what you&rsquo;re trying to
              protect, then tell you honestly whether silver fits.
            </Text>
            <Text style={li}>If it doesn&rsquo;t fit, they&rsquo;ll tell you that too.</Text>

            <Text style={p}>
              Prefer to talk now? Call{" "}
              <Link href={telHref} style={link}>
                {phone}
              </Link>
              , Monday&ndash;Friday, 8am&ndash;6pm Pacific.
            </Text>

            <Text style={trust}>
              Your metal is held in your name with Equity Trust and Delaware Depository.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={fBrand}>Anchor Silver Capital</Text>
            <Text style={fLine}>2450 Colorado Avenue, Suite 300, Santa Monica, CA 90404</Text>
            <Text style={fLine}>
              info@anchorsilvercapital.com &nbsp;·&nbsp; {phone}
            </Text>
            <Hr style={fHr} />
            <Text style={disc}>
              Anchor Silver Capital is a precious metals dealer, not a registered investment
              advisor. Precious metals involve risk; past performance does not guarantee
              future results. You&rsquo;re receiving this because you requested information at
              anchorsilvercapital.com.
            </Text>
            <Text style={disc}>
              <Link href={unsubscribeUrl} style={discLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ---- styles (inline objects; email-client safe) ---- */
const body: React.CSSProperties = {
  backgroundColor: "#e7e9e2",
  fontFamily: "Arial, Helvetica, sans-serif",
  margin: 0,
  padding: "24px 0",
};
const container: React.CSSProperties = {
  width: "600px",
  maxWidth: "100%",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};
const header: React.CSSProperties = {
  backgroundColor: "#16261f",
  padding: "26px 40px",
};
const wordmark: React.CSSProperties = {
  color: "#ffffff",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "17px",
  letterSpacing: "3px",
  margin: 0,
  fontWeight: "bold",
};
const main: React.CSSProperties = { padding: "36px 40px 8px" };
const h1: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "26px",
  lineHeight: "1.2",
  color: "#16261f",
  margin: "0 0 18px",
  fontWeight: "normal",
};
const h2: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "17px",
  color: "#16261f",
  margin: "6px 0 12px",
  fontWeight: "normal",
};
const p: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#1b2621",
  margin: "0 0 14px",
};
const li: React.CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.55",
  color: "#3d4a48",
  margin: "0 0 10px",
  paddingLeft: "16px",
  borderLeft: "2px solid #b98a4b",
};
const button: React.CSSProperties = {
  backgroundColor: "#b98a4b",
  color: "#1c1509",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  padding: "14px 30px",
  borderRadius: "4px",
  display: "inline-block",
};
const link: React.CSSProperties = { color: "#8a6432", fontWeight: "bold" };
const trust: React.CSSProperties = {
  fontSize: "13px",
  color: "#5a6a68",
  fontStyle: "italic",
  margin: "18px 0 4px",
};
const hr: React.CSSProperties = { borderColor: "#e3e1d8", margin: "26px 0" };
const footer: React.CSSProperties = { backgroundColor: "#16261f", padding: "28px 40px" };
const fBrand: React.CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#ffffff",
  fontSize: "15px",
  letterSpacing: "1px",
  margin: "0 0 6px",
};
const fLine: React.CSSProperties = { color: "#aebbb6", fontSize: "12px", margin: "0 0 3px" };
const fHr: React.CSSProperties = { borderColor: "rgba(255,255,255,0.12)", margin: "18px 0" };
const disc: React.CSSProperties = {
  color: "#8a9792",
  fontSize: "11px",
  lineHeight: "1.6",
  margin: "0 0 8px",
};
const discLink: React.CSSProperties = { color: "#aebbb6", textDecoration: "underline" };
