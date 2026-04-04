import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPublicAppName } from "@/services/auth/config";
import { getSupportEmail } from "@/shared/config/contact";

import styles from "@/pages/legal/legalDocument.module.css";

const EFFECTIVE_DATE = "April 2, 2026";

export default function DataDeletionPage() {
  const appName = getPublicAppName();
  const email = getSupportEmail();
  const subject = encodeURIComponent(`${appName} — data deletion request`);
  const mailto = `mailto:${email}?subject=${subject}`;

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
        <h1 className={styles.title}>User data deletion</h1>
        <p className={styles.updated}>Last updated: {EFFECTIVE_DATE}</p>

        <p>
          You can ask us to delete personal data associated with {appName}. This page describes
          how to request deletion and what we do when you used <strong>Facebook Login</strong> or
          other sign-in methods.
        </p>

        <h2>How to request deletion</h2>
        <p>
          Send an email from the address linked to your account to{" "}
          <a href={mailto} className={styles.email}>
            {email}
          </a>{" "}
          with the subject line “{appName} — data deletion request”. Include:
        </p>
        <ul>
          <li>The email address you used to sign in (or your Facebook-linked email if applicable)</li>
          <li>A short note that you want all personal data held for {appName} deleted</li>
        </ul>
        <p>
          We will verify ownership of the account where reasonable and process your request within a
          typical window (often within 30 days), subject to legal retention requirements.
        </p>

        <h2>What we delete</h2>
        <p>When your request is verified, we aim to remove or anonymize:</p>
        <ul>
          <li>Firebase Authentication profile data tied to your user ID (email, provider links, etc.)</li>
          <li>User-associated records in our databases (for example tasbeeh progress stored under your account)</li>
          <li>Other personal data we hold that is linked to your account in our systems</li>
        </ul>
        <p>
          Aggregated or de-identified analytics may remain where it cannot reasonably identify you.
        </p>

        <h2>If you signed in with Facebook</h2>
        <p>
          In addition to emailing us, you can remove the app from your Facebook account: Facebook →{" "}
          <strong>Settings &amp; privacy</strong> → <strong>Settings</strong> →{" "}
          <strong>Apps and Websites</strong> → find {appName} → <strong>Remove</strong>. That
          disconnects Facebook from the app; we still need a deletion request by email if you want
          us to delete data stored on our backend (Firebase) under your account.
        </p>

        <h2>Local data on your device</h2>
        <p>
          Clearing app data or uninstalling the app from your device removes locally stored
          preferences and tasbeeh progress that exist only on that device. Account deletion via
          email covers server-side data associated with your login.
        </p>

        <h2>Contact</h2>
        <p>
          Questions:{" "}
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
