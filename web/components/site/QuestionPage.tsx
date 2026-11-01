import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/site/Accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { ButtonLink, H2, Prose, Section } from "@/components/site/ui";
import { QUESTION_PAGES, feesReady, liveQuestionPages, questionPageLive } from "@/content/aeo";
import { faqPageSchema } from "@/lib/faq-schema";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

/**
 * One shared template for the six question pages. A page that is not live (flag off or content incomplete)
 * returns 404, has no metadata of its own, and is not in the nav or the sitemap (app/sitemap.ts adds it only
 * when questionPageLive() is true).
 */
function find(slug: string) {
  const p = QUESTION_PAGES.find((q) => q.slug === slug);
  if (!p) notFound();
  return p;
}

export function questionMetadata(slug: string): Metadata {
  const p = find(slug);
  if (!questionPageLive(p)) return { robots: { index: false, follow: false } };
  return pageMeta({ title: p.title, description: p.description, path: `/${p.slug}` });
}

export function QuestionPage({ slug }: { slug: string }) {
  const p = find(slug);
  if (!questionPageLive(p)) notFound();
  const path = `/${p.slug}`;
  const others = liveQuestionPages().filter((o) => o.slug !== p.slug);
  return (
    <>
      <JsonLd data={breadcrumbSchema(path, p.title)} />
      <JsonLd data={faqPageSchema(p.faqs)} />

      <PageHero eyebrow="Silver IRA" title={p.question} subtitle={p.answer!} />

      <Section>
        <div className="mx-auto max-w-3xl">
          {p.sections.map((s) => (
            <div key={s.heading} className="mt-10 first:mt-0">
              <H2>{s.heading}</H2>
              <Prose className="mt-4">
                {s.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </Prose>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-3xl">
          <H2>Related questions</H2>
          <div className="mt-8">
            <Accordion items={p.faqs} />
          </div>
          <p className="mt-8 text-sm text-muted-foreground">Last updated: {p.lastUpdated}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink to="/get-started" variant="primary">
              Free consultation
            </ButtonLink>
            {feesReady() && (
              <Link href="/fees" className="text-sm font-medium text-primary underline underline-offset-4">
                See every fee on one page
              </Link>
            )}
          </div>
          {others.length > 0 && (
            <ul className="mt-8 grid gap-2 text-sm">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/${o.slug}`} className="text-primary underline underline-offset-4">
                    {o.question}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>
    </>
  );
}
