import { QuestionPage, questionMetadata } from "@/components/site/QuestionPage";

// Flagged off: 404 until the copy in content/aeo.ts is written, approved and enabled.
export const generateMetadata = () => questionMetadata("silver-ira-fees");

export default function Page() {
  return <QuestionPage slug="silver-ira-fees" />;
}
