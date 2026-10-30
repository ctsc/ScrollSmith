import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles data on the website and MCP server.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`This policy explains what ${site.name} ("${site.shortName}", "we") collects when you use our website and MCP server, and why. The short version: no accounts, no tracking cookies, no ads. We keep a waitlist of emails you give us and anonymous usage counts.`}
    >
      <Section title="1. What we collect">
        <p><strong className="text-fg">Waitlist.</strong> If you join the waitlist we store your email address, the platforms you selected, the referral code in the link you used (for example <code className="font-mono text-xs">?ref=ig</code>) and the time you signed up.</p>
        <p><strong className="text-fg">Website events.</strong> When you use the install page we record anonymous events such as which assistant tab you opened and whether you copied the MCP link, together with the page path, the referring page and a one-way hash of your IP address. The hash cannot be reversed into your IP.</p>
        <p><strong className="text-fg">MCP server events.</strong> When an AI assistant connects to our MCP server it announces its name and version (for example &quot;claude-ai 1.0&quot;). We record that, the tool that was called and a one-way hash of the connecting IP. We do not receive or store your prompts, your conversation, or the content your assistant creates.</p>
        <p><strong className="text-fg">Server logs.</strong> Our hosting provider (Vercel) keeps standard request logs, including IP addresses, for a short period to run and secure the service.</p>
        <p>We do not use advertising trackers, third-party analytics scripts or cookies for tracking.</p>
      </Section>

      <Section title="2. Why we collect it">
        <ul className="list-disc space-y-1 pl-5">
          <li>to email you once when {site.shortName} launches (waitlist);</li>
          <li>to understand how many people connect the MCP server and from which assistants, so we can prioritise what to build;</li>
          <li>to rate-limit abuse and keep the service running.</li>
        </ul>
        <p>Where the law requires a legal basis, we rely on your consent (waitlist) and our legitimate interest in operating and improving a free service (anonymous usage counts and security).</p>
      </Section>

      <Section title="3. Who we share it with">
        <p>Only service providers that store or process data on our behalf:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong className="text-fg">Supabase</strong> — database that holds the waitlist and event tables.</li>
          <li><strong className="text-fg">Vercel</strong> — hosts the website and MCP server.</li>
        </ul>
        <p>We do not sell personal data and we do not share it with advertisers. We may disclose data if required by law.</p>
      </Section>

      <Section title="4. Your AI assistant">
        <p>
          Claude, ChatGPT, Gemini, Cursor and any other assistant you connect are separate services with their
          own privacy policies. What you type to them, and anything they generate, stays between you and that
          provider; it never passes through {site.shortName}.
        </p>
      </Section>

      <Section title="5. How long we keep it">
        <p>Waitlist emails are kept until you ask us to remove them or until we close the waitlist and have sent the launch email. Event rows are kept for up to 24 months, then deleted or aggregated.</p>
      </Section>

      <Section title="6. Your rights">
        <p>
          You can ask us to show, correct or delete the data we hold about you, or to remove you from the
          waitlist, at any time by emailing{" "}
          <a href={`mailto:${site.contactEmail}`} className="text-primary">{site.contactEmail}</a>. Residents of
          the EU/UK, California and other regions may have additional rights under local law; we will honour them.
        </p>
      </Section>

      <Section title="7. Children">
        <p>The Service is for people aged 18 and over. We do not knowingly collect data from anyone under 18. If you believe a minor has given us data, email us and we will delete it.</p>
      </Section>

      <Section title="8. Security">
        <p>Data is stored with access-controlled providers over encrypted connections. No system is perfectly secure; if we learn of a breach affecting your data we will notify you as required by law.</p>
      </Section>

      <Section title="9. Changes">
        <p>We will post any changes here and update the date at the top. Material changes to how we use waitlist emails will be announced by email.</p>
      </Section>

      <Section title="10. Contact">
        <p>
          {site.name} · <a href={`mailto:${site.contactEmail}`} className="text-primary">{site.contactEmail}</a>
        </p>
      </Section>
    </LegalPage>
  );
}
