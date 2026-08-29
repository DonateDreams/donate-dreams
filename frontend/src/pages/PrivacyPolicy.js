import React from 'react';

import GlassCard from '../components/GlassCard';

const PrivacyPolicy = () => {
  return (
    <div className="page document-page">

      <GlassCard className="document-card">

        <span className="section-kicker">
          DONATE DREAMS
        </span>

        <h1>
          Privacy Policy
        </h1>

        <p className="document-version">
          Version 1.0
        </p>

        <h2>
          Local V1 Storage
        </h2>

        <p>
          The current V1 version of Donate
          Dreams stores account information
          locally in your browser using
          browser storage.
        </p>

        <h2>
          Account Information
        </h2>

        <p>
          Your username, profile information,
          dream information, and account
          settings may be stored locally so
          that the application can function.
        </p>

        <h2>
          Passwords
        </h2>

        <p>
          Donate Dreams does not intentionally
          store your password as plain text.
          The V1 local authentication system
          derives a password hash using PBKDF2
          with a randomly generated salt.
        </p>

        <h2>
          Wallet Addresses
        </h2>

        <p>
          Wallet addresses that you voluntarily
          provide may be displayed publicly as
          part of a dream or profile.
        </p>

        <h2>
          Blockchain Information
        </h2>

        <p>
          Blockchain transactions may be
          publicly visible on the applicable
          blockchain network. Blockchain
          information may therefore not be
          private in the same way as ordinary
          application data.
        </p>

        <h2>
          Future Changes
        </h2>

        <p>
          A future version may introduce a
          backend or additional services.
          Such changes may require an updated
          privacy policy.
        </p>

        <h2>
          User Responsibility
        </h2>

        <p>
          Do not submit private keys, seed
          phrases, recovery phrases, passwords,
          or other secret credentials into
          public profile or dream fields.
        </p>

      </GlassCard>

    </div>
  );
};

export default PrivacyPolicy;