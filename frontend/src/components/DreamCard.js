import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import {
  getDreamTotal,
} from '../services/donationService';


const DreamCard = ({
  dream,
}) => {

  const navigate =
    useNavigate();


  /*
   * ========================================
   * IMAGE FALLBACK
   * ========================================
   */

  const [
    imageError,
    setImageError,
  ] = useState(false);


  /*
   * ========================================
   * RAISED AMOUNT
   * ========================================
   */

  const [
    raised,
    setRaised,
  ] = useState(
    Number(
      dream?.raised ||
      dream?.currentAmount ||
      dream?.totalEarned ||
      0
    ) || 0
  );


  /*
   * ========================================
   * LOAD SUPABASE DONATION TOTAL
   * ========================================
   */

  const loadRaised =
    async () => {

      if (!dream?.id) {
        return;
      }

      try {

        const total =
          await getDreamTotal(
            dream.id
          );

        /*
         * getDreamTotal() returns
         * a number from Supabase.
         */

        if (
          typeof total === 'number' &&
          Number.isFinite(total)
        ) {

          setRaised(
            total
          );

        }

      } catch (error) {

        /*
         * If Supabase cannot be reached,
         * keep using the amount stored
         * on the dream itself.
         */

        console.error(
          'Unable to load dream donation total:',
          error
        );

      }

    };


  /*
   * ========================================
   * INITIAL LOAD
   * ========================================
   */

  useEffect(() => {

    loadRaised();

  }, [
    dream?.id,
  ]);


  /*
   * ========================================
   * REFRESH AFTER DONATION
   * ========================================
   */

  useEffect(() => {

    const handleDonation =
      (event) => {

        const donation =
          event?.detail;

        /*
         * If the event belongs to this
         * dream, refresh immediately.
         *
         * Otherwise there is no need to
         * make another Supabase request.
         */

        if (
          donation?.dreamId &&
          String(
            donation.dreamId
          ) !== String(
            dream?.id
          )
        ) {

          return;

        }

        loadRaised();

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
   * SAFE DREAM VALUES
   * ========================================
   */

  const goal =
    Number(
      dream?.goal
    ) || 0;


  const safeRaised =
    Number(
      raised
    ) || 0;


  /*
   * ========================================
   * PROGRESS
   * ========================================
   */

  const percentage =
    goal > 0
      ? Math.min(
          (
            safeRaised /
            goal
          ) *
          100,
          100
        )
      : 0;


  /*
   * ========================================
   * AVATAR
   * ========================================
   */

  const avatarSeed =
    dream?.avatarSeed ||
    dream?.username ||
    dream?.name ||
    dream?.id ||
    'dream';


  const avatar =
    `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
      avatarSeed
    )}`;


  /*
   * ========================================
   * SUPPORT DREAM
   * ========================================
   *
   * IMPORTANT:
   *
   * The old card navigated to:
   *
   * /supportcreator?dream=ID
   *
   * We keep that route because your
   * SupportCreator page already exists.
   *
   * We also pass the dream through router
   * state so the page can immediately use
   * the exact dream object.
   */

  const handleSupport =
    () => {

      navigate(
        `/supportcreator?dream=${encodeURIComponent(
          dream.id
        )}`,
        {
          state: {
            dream,
          },
        }
      );

    };


  /*
   * ========================================
   * CARD
   * ========================================
   */

  return (
    <article className="dream-card">

      {/* ==================================
          CARD TOP
      ================================== */}

      <div className="dream-card-top">

        {!imageError ? (

          <img
            src={avatar}
            alt=""
            className="dream-avatar"
            onError={() =>
              setImageError(
                true
              )
            }
          />

        ) : (

          <div className="dream-avatar fallback-avatar">

            {(
              dream?.name ||
              dream?.username ||
              '?'
            )
              .charAt(0)
              .toUpperCase()}

          </div>

        )}


        <div className="dream-identity">

          <h3>
            {dream?.name ||
              'Anonymous Dreamer'}
          </h3>

          <span>
            @{dream?.username ||
              'dreamer'}
          </span>

        </div>


        {dream?.category && (

          <span className="dream-category">

            {dream.category}

          </span>

        )}

      </div>


      {/* ==================================
          BIO
      ================================== */}

      <p className="dream-bio">

        {dream?.bio ||
          dream?.description ||
          'Someone is working toward a dream that could use a little support.'}

      </p>


      {/* ==================================
          PROGRESS
      ================================== */}

      <div className="dream-progress">

        <div className="progress-label">

          <span>

            {safeRaised.toFixed(4)}
            {' '}
            ETH raised

          </span>


          <span>

            {goal.toFixed(2)}
            {' '}
            ETH

          </span>

        </div>


        <div className="progress-track">

          <div
            className="progress-fill"
            style={{
              width:
                `${percentage}%`,
            }}
          />

        </div>


        <small>

          {percentage.toFixed(0)}
          %
          {' '}
          of goal

        </small>

      </div>


      {/* ==================================
          SUPPORT BUTTON
      ================================== */}

      <button
        type="button"
        className="glass-button primary full-width"
        onClick={
          handleSupport
        }
      >

        Support This Dream

        <span>
          →
        </span>

      </button>

    </article>
  );
};


export default DreamCard;
