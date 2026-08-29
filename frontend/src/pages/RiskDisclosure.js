import React from 'react';

import GlassCard from '../components/GlassCard';

const RiskDisclosure = () => {
  return (
    <div className="page document-page">

      <GlassCard className="document-card">

        <span className="section-kicker">
          DONATE DREAMS
        </span>

        <h1>
          Donation & Risk Disclosure
        </h1>

        <p className="document-version">
          Version 1.0
        </p>

        <h2>
          Cryptocurrency Transactions
        </h2>

        <p>
          Cryptocurrency transactions are
          generally irreversible. Once a
          transaction has been confirmed,
          Donate Dreams may not be able to
          recover or reverse it.
        </p>

        <h2>
          Wallet Addresses
        </h2>

        <p>
          Always verify the destination
          wallet address before sending funds.
          Donate Dreams cannot guarantee that
          a user-entered address belongs to
          the intended recipient.
        </p>

        <h2>
          User Responsibility
        </h2>

        <p>
          Users are responsible for reviewing
          donation information, wallet
          addresses, transaction amounts,
          network selection, and applicable
          transaction fees before confirming
          a transaction.
        </p>

        <h2>
          No Guarantee of Results
        </h2>

        <p>
          Creating a dream does not guarantee
          that the dream will receive donations.
          Donations are voluntary and depend
          on supporters.
        </p>

        <h2>
          Network and Wallet Risks
        </h2>

        <p>
          Blockchain networks and third-party
          wallet software can experience
          congestion, outages, errors, fees,
          exploits, or other unexpected events.
        </p>

        <h2>
          Never Share Secret Credentials
        </h2>

        <p>
          Donate Dreams will never require
          your private key, seed phrase, or
          secret recovery phrase. Never enter
          or share these credentials with the
          website or another user.
        </p>

        <p className="document-warning">
          Please understand the risks before
          using cryptocurrency or donating
          digital assets.
        </p>

      </GlassCard>

    </div>
  );
};

export default RiskDisclosure;