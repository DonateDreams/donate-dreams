import React, {
  useEffect,
  useState,
} from 'react';

import DreamCrystal from './DreamCrystal';

import {
  getDreamDonations,
  getDreamTotal,
} from '../services/donationService';

import SupporterList from './SupporterList';

import DonationPanel from './DonationPanel';


const DreamDetailModal = ({
  dream,
  onClose,
  user = null,
}) => {

  /*
   * ========================================
   * DONATION MODE
   * ========================================
   */

  const [
    donationMode,
    setDonationMode,
  ] = useState(false);


  /*
   * ========================================
   * REFRESH
   * ========================================
   */

  const [
    refresh,
    setRefresh,
  ] = useState(0);


  /*
   * ========================================
   * DONATION DATA
   * ========================================
   */

  const [
    donated,
    setDonated,
  ] = useState(0);


  const [
    donations,
    setDonations,
  ] = useState([]);


  /*
   * ========================================
   * LOADING STATE
   * ========================================
   */

  const [
    loadingDonations,
    setLoadingDonations,
  ] = useState(false);


  /*
   * ========================================
   * LISTEN FOR NEW DONATIONS
   * ========================================
   */

  useEffect(() => {

    const handleDonation =
      (event) => {

        const donation =
          event?.detail;

        /*
         * If this event belongs to another
         * dream, don't refresh this modal.
         */

        if (
          donation?.dreamId &&
          dream?.id &&
          String(
            donation.dreamId
          ) !== String(
            dream.id
          )
        ) {
          return;
        }

        setRefresh(
          (value) =>
            value + 1
        );

      };


    window.addEventListener(
      'donateDreams:donationCreated',
      handleDonation
    );


    return () => {

      window.removeEventListener(
        'donateDreams:donationCreated',
        handleDonation
      );

    };

  }, [
    dream?.id,
  ]);


  /*
   * ========================================
   * LOAD DONATION DATA
   * ========================================
   */

  useEffect(() => {

    if (!dream?.id) {
      return;
    }


    let cancelled = false;


    const loadDonationData =
      async () => {

        setLoadingDonations(
          true
        );


        try {

          const [
            total,
            dreamDonations,
          ] = await Promise.all([

            getDreamTotal(
              dream.id
            ),

            getDreamDonations(
              dream.id
            ),

          ]);


          if (cancelled) {
            return;
          }


          setDonated(
            Number(total) || 0
          );


          setDonations(
            Array.isArray(
              dreamDonations
            )
              ? dreamDonations
              : []
          );

        } catch (error) {

          if (cancelled) {
            return;
          }


          console.error(
            'Unable to load dream donation data:',
            error
          );


          /*
           * Fall back to values already
           * stored on the dream.
           */

          setDonated(
            Number(
              dream.currentAmount ||
              dream.raised ||
              dream.totalEarned ||
              0
            ) || 0
          );


          setDonations([]);

        } finally {

          if (!cancelled) {

            setLoadingDonations(
              false
            );

          }

        }

      };


    loadDonationData();


    return () => {

      cancelled = true;

    };

  }, [
    dream?.id,
    refresh,
  ]);


  /*
   * ========================================
   * NO DREAM
   * ========================================
   */

  if (!dream) {
    return null;
  }


  /*
   * ========================================
   * GOAL
   * ========================================
   */

  const goal =
    Number(
      dream.goal ||
      dream.targetAmount ||
      0
    ) || 0;


  /*
   * ========================================
   * CURRENT TOTAL
   * ========================================
   */

  const fallbackCurrent =
    Number(
      dream.currentAmount ||
      dream.raised ||
      dream.totalEarned ||
      0
    ) || 0;


  const current =
    donated > 0
      ? donated
      : fallbackCurrent;


  /*
   * ========================================
   * PROGRESS
   * ========================================
   */

  const progress =
    goal > 0
      ? Math.min(
          100,
          (
            current /
            goal
          ) *
          100
        )
      : 0;


  /*
   * ========================================
   * MODAL
   * ========================================
   */

  return (
    <div
      className="dream-modal-backdrop"
      onMouseDown={onClose}
    >

      <div
        className="dream-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==================================
            CLOSE
        ================================== */}

        <button
          type="button"
          className="dream-modal-close"
          onClick={onClose}
          aria-label="Close dream"
        >
          ×
        </button>


        {!donationMode ? (

          <div className="dream-modal-grid">

            {/* ==================================
                CRYSTAL VISUAL
            ================================== */}

            <div className="dream-modal-visual">

              <span className="section-kicker">
                DREAM NODE
              </span>


              <DreamCrystal
                progress={
                  progress
                }
                size="large"
              />


              <div className="dream-node-status">

                <span className="status-dot" />

                ACTIVE

              </div>

            </div>


            {/* ==================================
                DREAM CONTENT
            ================================== */}

            <div className="dream-modal-content">

              <span className="section-kicker">

                {dream.category ||
                  'DREAM'}

              </span>


              <h2>

                {dream.title ||
                  dream.name ||
                  'Untitled Dream'}

              </h2>


              <p className="dream-modal-creator">

                @{dream.username ||
                  dream.creatorUsername ||
                  'creator'}

              </p>


              <p className="dream-modal-description">

                {dream.description ||
                  dream.bio ||
                  dream.story ||
                  'This dream is waiting for its story to be written.'}

              </p>


              {/* ==================================
                  FUNDING
              ================================== */}

              <div className="dream-modal-progress">

                <div className="progress-label">

                  <span>
                    FUNDING
                  </span>


                  <strong>

                    {progress.toFixed(
                      1
                    )}
                    %

                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${progress}%`,
                    }}
                  />

                </div>


                <div className="dream-modal-numbers">

                  <strong>

                    {current.toFixed(
                      4
                    )}
                    {' '}
                    ETH

                  </strong>


                  <span>

                    goal{' '}

                    {goal.toFixed(
                      4
                    )}

                    ETH

                  </span>

                </div>

              </div>


              {/* ==================================
                  ACTIONS
              ================================== */}

              <div className="dream-modal-actions">

                <button
                  type="button"
                  className="glass-button primary"
                  onClick={() =>
                    setDonationMode(
                      true
                    )
                  }
                >

                  Support Dream

                  <span>
                    →
                  </span>

                </button>


                <button
                  type="button"
                  className="glass-button secondary"
                  onClick={async () => {

                    try {

                      await navigator.clipboard.writeText(
                        window.location.href
                      );

                    } catch {

                      /*
                       * Clipboard support
                       * is optional.
                       */

                    }

                  }}
                >

                  Share

                </button>

              </div>


              {/* ==================================
                  SUPPORTERS
              ================================== */}

              <div className="dream-supporters">

                <div className="section-heading">

                  <div>

                    <span className="section-kicker">

                      SUPPORTERS

                    </span>


                    <h3>

                      {loadingDonations
                        ? '…'
                        : donations.length}

                    </h3>

                  </div>

                </div>


                <SupporterList
                  donations={
                    donations
                  }
                />

              </div>

            </div>

          </div>

        ) : (

          /* ==================================
             DONATION PANEL
          ================================== */

          <DonationPanel
            dream={dream}
            user={user}
            onClose={() =>
              setDonationMode(
                false
              )
            }
            onDonationRecorded={() =>
              setRefresh(
                (value) =>
                  value + 1
              )
            }
          />

        )}

      </div>

    </div>
  );
};


export default DreamDetailModal;
