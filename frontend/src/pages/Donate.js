import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import GlassCard from '../components/GlassCard';

import {
  getDreamById,
} from '../services/dreamService';

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


const ZERO_ADDRESS =
  '0x0000000000000000000000000000000000000000';


const Donate = () => {

  const [
    searchParams,
  ] = useSearchParams();

  const dreamId =
    searchParams.get('dream');


  const [
    amount,
    setAmount,
  ] = useState('');


  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    submitted,
    setSubmitted,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState('');


  /*
   * ========================================
   * LOAD SELECTED DREAM
   * ========================================
   */

 const [
  dream,
  setDream,
] = useState(null);


useEffect(() => {

  const loadDream = async () => {

    if (!dreamId) {

      setDream(null);

      return;
    }

    try {

      const loadedDream =
        await getDreamById(
          dreamId
        );

      setDream(
        loadedDream
      );

    } catch (error) {

      console.error(
        'Unable to load dream:',
        error
      );

      setDream(null);
    }
  };

  loadDream();

}, [dreamId]);


  /*
   * ========================================
   * NO DREAM SELECTED
   * ========================================
   *
   * This is what the Navbar's Donate
   * button should show.
   */

  if (!dreamId) {

    return (
      <div className="page centered-page">

        <GlassCard
          className="donate-page-card"
        >

          <div className="donate-icon">
            ✦
          </div>


          <span className="section-kicker">
            MAKE AN IMPACT
          </span>


          <h1>
            Give someone a reason
            to keep dreaming.
          </h1>


          <p>
            Find a dream you believe in
            and support the person behind it.
            Your support goes directly to
            their public wallet.
          </p>


          <div className="donate-options">

            <Link
              to="/supportcreator"
              className="donate-option"
            >

              <div className="option-icon">
                ♡
              </div>


              <div>

                <strong>
                  Support a Dream
                </strong>

                <span>
                  Browse dreams and choose
                  someone you'd like to help.
                </span>

              </div>


              <span>
                →
              </span>

            </Link>


            <Link
              to="/earninghope"
              className="donate-option"
            >

              <div className="option-icon">
                ✦
              </div>


              <div>

                <strong>
                  Create Your Own Dream
                </strong>

                <span>
                  Share your goal with the
                  Donate Dreams community.
                </span>

              </div>


              <span>
                →
              </span>

            </Link>

          </div>


          <div className="prototype-notice">

            <strong>
              DIRECT WALLET SUPPORT
            </strong>

            <span>
              Donate Dreams does not custody
              your funds or connect to your
              wallet. Supporters copy the
              creator's public wallet address
              and send funds manually using
              their own wallet.
            </span>

          </div>

        </GlassCard>

      </div>
    );

  }


  /*
   * ========================================
   * INVALID DREAM ID
   * ========================================
   */

  if (!dream) {

    return (
      <div className="page centered-page">

        <GlassCard
          className="donate-page-card"
        >

          <div className="donate-icon">
            ◌
          </div>


          <span className="section-kicker">
            DREAM NOT FOUND
          </span>


          <h1>
            We couldn't find that dream.
          </h1>


          <p>
            The dream may have been removed
            or the support link may be invalid.
          </p>


          <Link
            to="/supportcreator"
            className="glass-button primary"
          >
            Explore Dreams
            <span>
              →
            </span>
          </Link>

        </GlassCard>

      </div>
    );

  }


  /*
   * ========================================
   * WALLET
   * ========================================
   */

  const wallet =
    dream.wallet ||
    dream.walletAddress ||
    '';


  const normalizedWallet =
    normalizeAddress(
      wallet
    );


  const validWallet =
    isValidAddress(
      normalizedWallet
    );


  const isDemoWallet =
    normalizedWallet.toLowerCase() ===
    ZERO_ADDRESS;


  /*
   * ========================================
   * COPY WALLET
   * ========================================
   */

  const handleCopyWallet =
    async () => {

      if (!validWallet) {
        return;
      }

      try {

        await navigator.clipboard.writeText(
          normalizedWallet
        );

        setCopied(true);

        setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );

      } catch (copyError) {

        setError(
          'Unable to copy the wallet address. Please copy it manually.'
        );

      }

    };


  /*
   * ========================================
   * RECORD SUPPORT
   * ========================================
   */

  const handleSupportSent = async () => {

      setError('');


      if (!validWallet) {

        setError(
          'This dream does not have a valid wallet address.'
        );

        return;
      }


      if (isDemoWallet) {

        setError(
          'This is a demonstration dream. Do not send real funds to the demo address.'
        );

        return;
      }


      const numericAmount =
        Number(amount);


      if (
        !Number.isFinite(
          numericAmount
        ) ||
        numericAmount <= 0
      ) {

        setError(
          'Enter a support amount greater than 0 ETH.'
        );

        return;
      }


      try {

        const donation =
  	  await createDonation({

            dreamId:
              dream.id,

            donorUserId:
              null,

            donorUsername:
              'Anonymous',

            creatorUserId:
              dream.userId || null,

            amount:
              numericAmount,

            walletAddress:
              normalizedWallet,

            transactionHash:
              null,

            network:
              'Manual Wallet Transfer'

          });


        addActivity({

          userId:
            dream.userId || null,

          type:
            'donation',

          title:
            'Dream received support',

          description:
            `A supporter recorded ${donation.amount} ETH of support for ${dream.name || 'this dream'}.`,

          amount:
            donation.amount,

          dreamId:
            dream.id

        });


        setSubmitted(
          true
        );


      } catch (supportError) {

        console.error(
          'Unable to record support:',
          supportError
        );

        setError(
          supportError.message ||
          'Unable to record support.'
        );

      }

    };


  /*
   * ========================================
   * SUCCESS
   * ========================================
   */

  if (submitted) {

    return (
      <div className="page centered-page">

        <GlassCard
          className="donate-page-card"
        >

          <div className="donate-icon">
            ✓
          </div>


          <span className="section-kicker">
            SUPPORT RECORDED
          </span>


          <h1>
            Thank you for supporting
            {' '}
            {dream.name}.
          </h1>


          <p>
            Your support has been recorded
            in the Donate Dreams prototype.
          </p>


          <div className="prototype-notice">

            <strong>
              V9 PROTOTYPE
            </strong>

            <span>
              Donate Dreams does not verify
              blockchain transactions. The
              actual transfer, if completed,
              happens directly between wallets.
            </span>

          </div>


          <div className="button-row">

            <Link
              to="/supportcreator"
              className="glass-button primary"
            >
              Find Another Dream
              <span>
                →
              </span>
            </Link>


            <Link
              to="/"
              className="glass-button secondary"
            >
              Back Home
            </Link>

          </div>

        </GlassCard>

      </div>
    );

  }


  /*
   * ========================================
   * SELECTED DREAM
   * ========================================
   */

  return (
    <div className="page centered-page">

      <GlassCard
        className="donate-page-card"
      >

        <div className="donate-icon">
          ♡
        </div>


        <span className="section-kicker">
          SUPPORT THIS DREAM
        </span>


        <h1>
          {dream.name ||
            'Someone\'s Dream'}
        </h1>


        <p className="username">
          @{dream.username ||
            'dreamer'}
        </p>


        <p>
          {dream.bio ||
            'Every bit of support can help move this dream forward.'}
        </p>


        <div className="dream-card-stats">

          <div>

            <span>
              GOAL
            </span>

            <strong>
              {dream.goal ||
                '0.0000'}
              {' '}
              ETH
            </strong>

          </div>


          <div>

            <span>
              RAISED
            </span>

            <strong>
              {dream.raised ||
                '0.0000'}
              {' '}
              ETH
            </strong>

          </div>

        </div>


        {/* ==============================
            WALLET
        ============================== */}

        <div className="wallet-support-box">

          <span className="section-kicker">
            CREATOR WALLET
          </span>


          {!validWallet ? (

            <p>
              This dream does not currently
              have a valid receiving wallet.
            </p>

          ) : (

            <>

              <div className="wallet-address">
                {normalizedWallet}
              </div>


              {isDemoWallet ? (

                <div className="prototype-notice">

                  <strong>
                    DEMO ADDRESS
                  </strong>

                  <span>
                    This is a sample dream.
                    Do not send real
                    cryptocurrency to this
                    address.
                  </span>

                </div>

              ) : (

                <>

                  <button
                    type="button"
                    className="glass-button secondary"
                    onClick={
                      handleCopyWallet
                    }
                  >
                    {copied
                      ? 'Copied ✓'
                      : 'Copy Wallet Address'}
                  </button>


                  <p>
                    Copy this public wallet
                    address, then open MetaMask
                    or another compatible wallet
                    and send your support manually.
                  </p>

                </>

              )}

            </>

          )}

        </div>


        {/* ==============================
            AMOUNT
        ============================== */}

        {validWallet &&
          !isDemoWallet && (

          <div className="donation-amount-section">

            <label>

              Support amount

              <div className="amount-input-wrap">

                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="0.05"
                />

                <span>
                  ETH
                </span>

              </div>

            </label>

          </div>

        )}


        {/* ==============================
            ERROR
        ============================== */}

        {error && (

          <div className="error-box">
            {error}
          </div>

        )}


        {/* ==============================
            ACTIONS
        ============================== */}

        <div className="button-row">

          <Link
            to="/supportcreator"
            className="glass-button secondary"
          >
            Back
          </Link>


          {validWallet &&
            !isDemoWallet && (

            <button
              type="button"
              className="glass-button primary"
              onClick={
                handleSupportSent
              }
            >
              I've Sent My Support
              <span>
                →
              </span>
            </button>

          )}

        </div>


        <div className="prototype-notice">

          <strong>
            DIRECT WALLET SUPPORT
          </strong>

          <span>
            Donate Dreams never connects
            to MetaMask, never requests
            private keys, and never controls
            your funds. You send funds directly
            to the creator using your own wallet.
          </span>

        </div>

      </GlassCard>

    </div>
  );

};


export default Donate;

