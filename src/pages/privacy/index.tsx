import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPublicAppName } from "@/services/auth/config";
import { getSupportEmail } from "@/shared/config/contact";

import styles from "@/pages/legal/legalDocument.module.css";

const EFFECTIVE_DATE = "April 2, 2026";

export default function PrivacyPage() {
  const appName = getPublicAppName();
  const email = getSupportEmail();

  return (
    <main className={styles.root}>
      <nav className={styles.back} aria-label="Back">
        <Link to="/sign-in" className={styles.backLink}>
          <ArrowLeft size={18} strokeWidth={2} aria-hidden />
          Back to sign in
        </Link>
      </nav>

      <article className={styles.prose}>
        <p className={styles.brand}>{appName}</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Effective date: {EFFECTIVE_DATE}</p>

        <p>
          {appName} (“we”, “us”) is a calm, minimal app for daily dhikr (tasbeeh). This policy
          explains what information we process when you use the app and how we use services such as
          Google Firebase and, when you choose it, social sign-in providers like Facebook.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy or your data:{" "}
          <a href={`mailto:${email}`} className={styles.email}>
            {email}
          </a>
          .
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account and authentication.</strong> If you create an account or sign in, we use{" "}
            <strong>Firebase Authentication</strong> (Google LLC). Depending on how you sign in, we
            may receive your email address, a unique user ID, display name, and profile photo URL.
            If you use <strong>Facebook Login</strong>, Meta receives information according to their
            policies; we receive what you authorize (for example name and email) to create your
            account.
          </li>
          <li>
            <strong>App usage and dhikr data.</strong> Your tasbeeh counts, streaks, preferences,
            and related progress may be stored <strong>on your device</strong> (for example in local
            storage) and, when you are signed in, may be associated with your account in Firebase
            services so your experience can work across sessions or devices where we enable that.
          </li>
          <li>
            <strong>Diagnostics.</strong> We may use Firebase <strong>Analytics</strong>,{" "}
            <strong>Crashlytics</strong>, and similar tools to understand stability and usage in an
            aggregated form (for example crashes, app version, device type).
          </li>
          <li>
            <strong>Configuration.</strong> We may use Firebase <strong>Remote Config</strong> (or
            similar) to deliver feature flags and text without storing personal content about you in
            that system beyond what the platform requires to serve the config.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <p>
          We use the data above to provide and improve {appName}: authentication, syncing or
          restoring your progress where implemented, personalizing language or theme where
          applicable, fixing bugs, and understanding aggregate usage. We do not sell your personal
          information.
        </p>

        <h2>Firebase and subprocessors</h2>
        <p>
          Firebase services are operated by Google. Their privacy practices are described in Google’s
          and Firebase’s documentation. Data may be processed in accordance with your region and
          Google’s terms.
        </p>

        <h2>Retention</h2>
        <p>
          We keep information only as long as needed to run the service or as required by law. You can
          request deletion of data associated with your account; see our{" "}
          <Link to="/data-deletion">Data deletion</Link> page.
        </p>

        <h2>Children</h2>
        <p>
          {appName} is not directed at children under 13 (or the minimum age in your jurisdiction).
          If you believe we have collected a child’s data, contact us at the email above.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy. We will post the new version here and adjust the effective date
          when we do.
        </p>

        <p className={styles.note}>
          This summary is provided for transparency. Your rights depend on your location (for example
          GDPR or CCPA). For specific requests, email us at the address above.
        </p>

        <p className={styles.crossLinks}>
          <Link to="/data-deletion">How to request deletion of your data →</Link>
        </p>
      </article>
    </main>
  );
}
