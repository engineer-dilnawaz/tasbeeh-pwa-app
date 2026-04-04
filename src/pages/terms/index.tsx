import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPublicAppName } from "@/services/auth/config";
import { getSupportEmail } from "@/shared/config/contact";

import styles from "@/pages/legal/legalDocument.module.css";
import termsStyles from "@/pages/terms/Terms.module.css";

const EFFECTIVE_DATE = "April 2, 2026";

export default function TermsPage() {
  const appName = getPublicAppName();
  const email = getSupportEmail();

  return (
    <main className={styles.root}>
      <nav className={styles.back} aria-label="Back">
        <Link to="/onboarding" className={styles.backLink}>
          <ArrowLeft size={18} strokeWidth={2} aria-hidden />
          Back to onboarding
        </Link>
      </nav>

      <article className={styles.prose}>
        <h1 className={termsStyles.title}>
          <span className={termsStyles.titleMedium}>Terms &amp; </span>
          <span className={termsStyles.titleBold}>Conditions</span>
        </h1>
        <p className={styles.updated}>Effective date: {EFFECTIVE_DATE}</p>

        <p>
          These Terms &amp; Conditions (“Terms”) govern your use of {appName}, a
          mobile web app for daily dhikr (tasbeeh). By accessing or using the
          app, you agree to these Terms. If you do not agree, please do not use
          the service.
        </p>

        <h2>Use of the service</h2>
        <p>
          {appName} is provided for personal, non-commercial spiritual practice.
          You agree to use the app only in compliance with applicable laws and
          in a respectful manner. You must not misuse the service, attempt to
          disrupt it, or access it through automated means except as allowed by
          the app’s normal operation.
        </p>

        <h2>Accounts and sign-in</h2>
        <p>
          If you create an account or sign in (including with email or
          third-party providers), you are responsible for safeguarding your
          credentials and for activity under your account. You must provide
          accurate information where requested.
        </p>

        <h2>Content and disclaimer</h2>
        <p>
          Religious and wellness content in the app is offered for inspiration
          and routine support. It is not medical, psychological, or legal
          advice. Use of counters, reminders, or statistics is at your own
          discretion.
        </p>

        <h2>Changes and availability</h2>
        <p>
          We may update features, text, or these Terms. Continued use after
          changes constitutes acceptance of the updated Terms where required by
          law. The service may be modified or discontinued with reasonable
          notice when practical.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {appName} and its operators
          are not liable for any indirect, incidental, or consequential damages
          arising from your use of the app. The app is provided “as is” without
          warranties of any kind except where mandatory rights apply in your
          jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${email}`} className={styles.email}>
            {email}
          </a>
          .
        </p>

        <p className={styles.crossLinks}>
          <Link to="/privacy">Privacy Policy →</Link>
        </p>
      </article>
    </main>
  );
}
