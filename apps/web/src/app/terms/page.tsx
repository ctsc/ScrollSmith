import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using the ${site.name} website and MCP server.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These terms govern your use of the ${site.name} website (${new URL(site.url).host}) and the ${site.shortName} MCP server (the "Service"). By joining the waitlist, visiting the site or connecting the MCP server to an AI assistant, you agree to them. If you do not agree, do not use the Service.`}
    >
      <Section title="1. Who we are">
        <p>
          The Service is operated by {site.name} (&quot;{site.shortName}&quot;, &quot;we&quot;, &quot;us&quot;). Contact:{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-primary">{site.contactEmail}</a>.
        </p>
      </Section>

      <Section title="2. What the Service is">
        <p>
          {site.shortName} is a free MCP (Model Context Protocol) server. It provides instructions, templates and
          other &quot;skills&quot; that your own AI assistant (such as Claude, ChatGPT, Gemini CLI or Cursor) can
          use to help you create short-form content. {site.shortName} does not run AI models, does not generate
          video, images or audio itself, and does not store the content you create.
        </p>
        <p>
          Your AI assistant is a separate product governed by its own terms and pricing. We are not responsible
          for its availability, output or fees.
        </p>
      </Section>

      <Section title="3. Eligibility">
        <p>
          You must be at least 18 years old to use the Service. If we introduce accounts, anyone under 18 will
          need a parent or guardian&apos;s approval to register.
        </p>
      </Section>

      <Section title="4. Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>use the Service to create content that is illegal, infringing, hateful, harassing, sexually explicit involving minors, or that violates the policies of the platform you post it to;</li>
          <li>probe, overload, scrape or disrupt the MCP server or website, or bypass any rate limit;</li>
          <li>misrepresent content made with the Service as being endorsed by {site.shortName};</li>
          <li>resell or rehost the Service as your own without permission.</li>
        </ul>
      </Section>

      <Section title="5. Your content">
        <p>
          You own what you make. Because {site.shortName} does not generate or store your content, we claim no
          rights in it. You are solely responsible for the content you create and publish, including rights to
          any material you provide to your AI assistant and compliance with each platform&apos;s rules.
        </p>
      </Section>

      <Section title="6. Our content">
        <p>
          The website, brand, mascot and the skills served by the MCP server are owned by {site.shortName} or
          its licensors. You may use the skills through your AI assistant to make your own content. You may not
          copy the skills library as a whole to build a competing service.
        </p>
      </Section>

      <Section title="7. Free service, no warranty">
        <p>
          The Service is provided free of charge, &quot;as is&quot; and &quot;as available&quot;, without warranties of any
          kind, express or implied, including fitness for a particular purpose, accuracy of any skill output, or
          uninterrupted availability. We may change, suspend or discontinue any part of the Service at any time.
        </p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {site.shortName} will not be liable for any indirect, incidental,
          special, consequential or punitive damages, or any loss of revenue, data or goodwill, arising from your
          use of the Service. Our total liability for any claim is limited to USD 50.
        </p>
      </Section>

      <Section title="9. Privacy">
        <p>
          How we handle data is described in our <Link href="/privacy" className="text-primary">Privacy Policy</Link>.
        </p>
      </Section>

      <Section title="10. Changes">
        <p>
          We may update these terms. The &quot;last updated&quot; date above changes when we do. Continuing to use the
          Service after a change means you accept the new terms.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>
          These terms are governed by the laws of the United States and the state in which {site.shortName}
          operates, without regard to conflict-of-law rules. Any dispute will be resolved in the courts located
          there.
        </p>
      </Section>
    </LegalPage>
  );
}
