import React, { useMemo, useState } from 'react';

import {
  createDonation,
} from '../services/donationService';

import {
  addActivity,
} from '../services/activityService';

import {
  isValidAddress,
  normalizeAddress,
} from '../services/walletService';


const DonationPanel = ({
  dream,
  user = null,
  onClose,
  onDonationRecorded,
}) => {
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [recorded, setRecorded] = useState(false);
  const [saving, setSaving] = useState(false);

  const wallet = normalizeAddress(
    dream?.wallet ||
    dream?.walletAddress ||
    ''
  );

  const validWallet =
    isValidAddress(wallet);

  const currentRaised =
    Number(dream?.raised) ||
    Number(dream?.currentAmount) ||
    0;

  const goal =
    Number(dream?.goal) ||
    Number(dream?.targetAmount) ||
    0;

  const remaining = useMemo(() => {
    if (goal <= 0) {
      return null;
    }

    return Math.max(
      0,
      goal - currentRaised
    );
  }, [
    goal,
    currentRaised,
  ]);

  const numericAmount =
    Number(amount) || 0;


  /*
   * Convert ETH to wei without
   * floating-point arithmetic.
   *
   * Avoids BigInt so older ESLint
   * configurations do not complain.
   */
  const ethToWei = (value) => {
    const clean =
      String(value).trim();

    if (
      !/^\d+(\.\d+)?$/.test(clean)
    ) {
      return null;
    }

    const [
      whole,
      decimal = '',
    ] = clean.split('.');

    const paddedDecimal =
      (
        decimal +
        '000000000000000000'
      ).slice(0, 18);

    try {
      const wholeWei =
        whole
          .split('')
          .reduce(
            (total, digit) =>
              total * 10 +
              Number(digit),
            0
          );

      /*
       * For the payment URI we can safely
       * construct the decimal string directly.
       */
      const decimalWei =
        paddedDecimal || '0';

      return (
        String(
          wholeWei *
          1000000000000000000
        ).split('.')[0] +
        decimalWei
      ).replace(/^0+(?=\d)/, '');

    } catch {
      return null;
    }
  };


  const paymentUri = useMemo(() => {
    if (
      !validWallet ||
      numericAmount <= 0
    ) {
      return '';
    }

    const wei =
      ethToWei(amount);

    if (!wei) {
      return '';
    }

    return (
      `ethereum:${wallet}?value=${wei}`
    );

  }, [
    wallet,
    amount,
    numericAmount,
    validWallet,
  ]);


  const copyAddress = async () => {
    setError('');
    setCopied(false);

    if (!validWallet) {
      setError(
        'This dream does not have a valid wallet address.'
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(
        wallet
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2200);

    } catch {
      setError(
        'Unable to copy the wallet address. Please copy it manually.'
      );
    }
  };


  const openWallet = () => {
    setError('');

    if (!validWallet) {
      setError(
        'This dream does not have a valid wallet address.'
      );
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        'Enter the amount of ETH you want to send first.'
      );
      return;
    }

    if (!paymentUri) {
      setError(
        'Unable to prepare the wallet payment.'
      );
      return;
    }

    window.location.href =
      paymentUri;
  };


  const recordDonation = async () => {
    setError('');

    if (!validWallet) {
      setError(
        'This dream does not have a valid wallet address.'
      );
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        'Enter a donation amount greater than zero.'
      );
      return;
    }

    if (
      remaining !== null &&
      numericAmount > remaining
    ) {
      setError(
        `This donation is larger than the remaining dream goal of ${remaining.toFixed(4)} ETH.`
      );
      return;
    }

    setSaving(true);

    try {
      const donation =
 	await createDonation({
          dreamId:
            dream.id,

          donorUserId:
            user?.id || null,

          donorUsername:
            user?.username ||
            'Anonymous',

          creatorUserId:
            dream.userId ||
            dream.creatorUserId ||
            null,

          amount:
            numericAmount,

          walletAddress:
            wallet,

          transactionHash:
            transactionHash.trim() ||
            null,

          network:
            'Ethereum',
        });


      addActivity({
        userId:
          user?.id || null,

        type:
          'donation',

        title:
          'Dream supported',

        description:
          `${user?.username || 'Anonymous'} supported ${dream.name || dream.title || 'a dream'}.`,

        amount:
          numericAmount,

        dreamId:
          dream.id,
      });


      setRecorded(true);


      if (onDonationRecorded) {
        onDonationRecorded(
          donation
        );
      }

    } catch (recordError) {
      setError(
        recordError?.message ||
        'Unable to record the donation.'
      );

    } finally {
      setSaving(false);
    }
  };


  if (!dream) {
    return null;
  }


  /*
   * =========================================
   * SUCCESS
   * =========================================
   */

  if (recorded) {
    return (
      <div className="donation-panel">

        <div className="donation-success-icon">
          ✓
        </div>

        <span className="section-kicker">
          DONATION RECORDED
        </span>

        <h3>
          Thank you for supporting this dream.
        </h3>

        <p>
          Your donation has been recorded
          in this browser.
        </p>

        <div className="donation-record-summary">

          <div>
            <span>
              AMOUNT
            </span>

            <strong>
              {numericAmount.toFixed(4)} ETH
            </strong>
          </div>

          <div>
            <span>
              DESTINATION
            </span>

            <strong className="wallet-short">
              {wallet.slice(0, 10)}
              ...
              {wallet.slice(-8)}
            </strong>
          </div>

          <div>
            <span>
              STATUS
            </span>

            <strong>
              {transactionHash.trim()
                ? 'REPORTED'
                : 'RECORDED'}
            </strong>
          </div>

        </div>

        <p className="donation-disclaimer">
          Donate Dreams does not verify or
          custody this transaction. The record
          above is based on the information
          you submitted.
        </p>

        <button
          type="button"
          className="glass-button primary full-width"
          onClick={onClose}
        >
          Done
          <span>
            ✓
          </span>
        </button>

      </div>
    );
  }


  /*
   * =========================================
   * DONATION FORM
   * =========================================
   */

  return (
    <div className="donation-panel">

      <div className="donation-panel-header">

        <span className="section-kicker">
          SUPPORT THIS DREAM
        </span>

        <h3>
          Send support directly.
        </h3>

        <p>
          Your ETH goes directly from your
          wallet to this creator's wallet.
          Donate Dreams does not receive
          or hold the funds.
        </p>

      </div>


      {error && (
        <div className="error-box donation-error">
          {error}
        </div>
      )}


      <div className="donation-section">

        <label className="donation-field">

          <span>
            Donation amount
          </span>

          <div className="input-with-suffix">

            <input
              type="number"
              min="0.0001"
              step="0.0001"
              value={amount}
              onChange={(event) =>
                setAmount(
                  event.target.value
                )
              }
              placeholder="0.10"
            />

            <span>
              ETH
            </span>

          </div>

          {remaining !== null && (
            <small>
              {remaining.toFixed(4)} ETH
              {' '}
              remaining toward the goal.
            </small>
          )}

        </label>

      </div>


      <div className="donation-section">

        <div className="donation-wallet-box">

          <div className="donation-wallet-content">

            <span className="section-kicker">
              SEND TO
            </span>

            <strong className="donation-wallet">
              {validWallet
                ? wallet
                : 'Wallet unavailable'}
            </strong>

          </div>

          <button
            type="button"
            className="glass-button secondary donation-copy-button"
            onClick={copyAddress}
            disabled={!validWallet}
          >
            {copied
              ? 'Copied ✓'
              : 'Copy Address'}
          </button>

        </div>

      </div>


      <div className="donation-section donation-send-section">

        <button
          type="button"
          className="glass-button primary full-width donation-send-button"
          onClick={openWallet}
          disabled={
            !validWallet ||
            numericAmount <= 0
          }
        >
          Open Wallet & Send
          <span>
            →
          </span>
        </button>

      </div>


      <div className="donation-divider">
        <span>
          AFTER YOU SEND
        </span>
      </div>


      <div className="donation-section">

        <label className="donation-field">

          <span>
            Transaction hash
            <em className="optional-label">
              optional
            </em>
          </span>

          <input
            value={transactionHash}
            onChange={(event) =>
              setTransactionHash(
                event.target.value
              )
            }
            placeholder="0x... (optional)"
          />

          <small>
            If your wallet gives you a transaction
            hash, paste it here.
          </small>

        </label>

      </div>


      <div className="donation-confirm-box">

        <div>
          <strong>
            Already sent it?
          </strong>

          <span>
            Record the donation after
            confirming the transaction
            in your wallet.
          </span>
        </div>

        <button
          type="button"
          className="glass-button primary donation-confirm-button"
          onClick={recordDonation}
          disabled={
            saving ||
            !validWallet ||
            numericAmount <= 0
          }
        >
          {saving
            ? 'Recording...'
            : 'I Sent It'}

          {!saving && (
            <span>
              ✓
            </span>
          )}
        </button>

      </div>


      <p className="donation-warning">
        <strong>
          Important:
        </strong>{' '}
        Always verify the wallet address
        and amount in your wallet before
        confirming a transaction. Blockchain
        transactions cannot normally be reversed.
      </p>


      <button
        type="button"
        className="donation-cancel"
        onClick={onClose}
      >
        Cancel
      </button>

    </div>
  );
};


export default DonationPanel;

