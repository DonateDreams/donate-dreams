import React, {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import GlassCard from '../components/GlassCard';

import {
  createDream,
} from '../services/dreamService';

import {
  isValidAddress,
} from '../services/walletService';


const EarningHope = () => {

  const navigate =
    useNavigate();


  const [
    name,
    setName,
  ] = useState('');


  const [
    username,
    setUsername,
  ] = useState('');


  const [
    bio,
    setBio,
  ] = useState('');


  const [
    wallet,
    setWallet,
  ] = useState('');


  const [
    goal,
    setGoal,
  ] = useState('1.00');


  const [
    category,
    setCategory,
  ] = useState('Other');


  const [
    error,
    setError,
  ] = useState('');


  const [
    success,
    setSuccess,
  ] = useState(false);


  const [
    createdDream,
    setCreatedDream,
  ] = useState(null);


  const handleSubmit = async (event) => {

      event.preventDefault();

      setError('');


      /*
       * NAME AND USERNAME ARE OPTIONAL.
       */

      const cleanName =
        name.trim();


      const cleanUsername =
        username
          .trim()
          .replace(/^@/, '');


      const cleanBio =
        bio.trim();


      const cleanWallet =
        wallet.trim();


      /*
       * STORY
       */

      if (
        cleanBio.length < 20
      ) {
        setError(
          'Please tell your story in at least 20 characters.'
        );

        return;
      }


      /*
       * WALLET
       */

      if (
        !isValidAddress(
          cleanWallet
        )
      ) {
        setError(
          'Please enter a valid EVM wallet address beginning with 0x.'
        );

        return;
      }


      /*
       * GOAL
       */

      const numericGoal =
        Number(goal);


      if (
        !goal ||
        !Number.isFinite(
          numericGoal
        ) ||
        numericGoal <= 0
      ) {
        setError(
          'Please enter a valid donation goal.'
        );

        return;
      }


      try {

        const dream =
  	  await createDream({

            name:
              cleanName,

            username:
              cleanUsername,

            bio:
              cleanBio,

            goal:
              numericGoal
                .toFixed(4),

            raised:
              '0.0000',

            wallet:
              cleanWallet,

            category,

            avatarSeed:
              cleanUsername ||
              cleanName ||
              'dream'

          });


        setCreatedDream(
          dream
        );


        setSuccess(
          true
        );

      } catch (
        submitError
      ) {

        setError(
          submitError?.message ||
          'Unable to publish your dream.'
        );

      }

    };


  /*
   * ========================================
   * SUCCESS
   * ========================================
   */

  if (success) {

    return (

      <div className="page centered-page">

        <GlassCard className="success-card">

          <div className="success-icon">
            ✦
          </div>


          <span className="section-kicker">
            DREAM PUBLISHED
          </span>


          <h1>
            Your dream is out there.
          </h1>


          <p>
            Your dream is now public and
            ready for people to discover.
          </p>


          {createdDream && (

            <div className="donation-record-summary">

              <div>

                <span>
                  DREAM
                </span>

                <strong>
                  {createdDream.name ||
                    'Anonymous Dreamer'}
                </strong>

              </div>


              <div>

                <span>
                  GOAL
                </span>

                <strong>
                  {Number(
                    createdDream.goal
                  ).toFixed(4)}
                  {' '}
                  ETH
                </strong>

              </div>


              <div>

                <span>
                  CATEGORY
                </span>

                <strong>
                  {createdDream.category}
                </strong>

              </div>

            </div>

          )}


          <div className="button-row centered">

            <button
              type="button"
              className="glass-button primary"
              onClick={() =>
                navigate(
                  '/supportcreator'
                )
              }
            >
              Discover Dreams
              <span>
                →
              </span>
            </button>


            <button
              type="button"
              className="glass-button secondary"
              onClick={() => {

                setSuccess(
                  false
                );

                setCreatedDream(
                  null
                );

                setName('');
                setUsername('');
                setBio('');
                setWallet('');
                setGoal('1.00');
                setCategory('Other');

              }}
            >
              Create Another
            </button>

          </div>

        </GlassCard>

      </div>

    );

  }


  /*
   * ========================================
   * FORM
   * ========================================
   */

  return (

    <div className="page">


      <section className="account-header">

        <div>

          <span className="section-kicker">
            CREATE A DREAM
          </span>


          <h1>
            Put your dream into the world.
          </h1>


          <p>
            No account. No password.
            No sign-up. Just tell your
            story and give people a way
            to support it.
          </p>

        </div>


        <button
          type="button"
          className="glass-button secondary"
          onClick={() =>
            navigate(
              '/supportcreator'
            )
          }
        >
          Explore Dreams
          <span>
            →
          </span>
        </button>

      </section>


      <GlassCard className="dream-form-card">

        <form
          onSubmit={
            handleSubmit
          }
          className="dream-form"
        >


          {error && (

            <div className="error-box">
              {error}
            </div>

          )}


          {/* ================================
              ABOUT YOU
          ================================= */}

          <div className="form-section">

            <span className="section-kicker">
              OPTIONAL IDENTITY
            </span>


            <h2>
              Who are you?
            </h2>


            <p className="form-description">
              You don't need an account.
              You can stay anonymous or
              give yourself a name.
            </p>


            <div className="form-grid">


              <label>

                Display name

                <span className="optional-label">
                  optional
                </span>


                <input
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Your name or Anonymous"
                  maxLength="60"
                />

              </label>


              <label>

                Username

                <span className="optional-label">
                  optional
                </span>


                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(
                      event.target.value
                    )
                  }
                  placeholder="@dreamer"
                  maxLength="30"
                />

              </label>


            </div>

          </div>


          {/* ================================
              STORY
          ================================= */}

          <div className="form-section">

            <span className="section-kicker">
              YOUR DREAM
            </span>


            <h2>
              Tell your story.
            </h2>


            <label>

              Category


              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >

                <option value="Other">
                  Other
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Creative">
                  Creative
                </option>

                <option value="Music">
                  Music
                </option>

                <option value="Technology">
                  Technology
                </option>

                <option value="Business">
                  Business
                </option>

                <option value="Community">
                  Community
                </option>

                <option value="Personal">
                  Personal
                </option>

              </select>

            </label>


            <label>

              Your story


              <textarea
                value={bio}
                onChange={(event) =>
                  setBio(
                    event.target.value
                  )
                }
                placeholder="What are you trying to accomplish? Why does this dream matter to you?"
                rows="8"
                maxLength="1000"
                required
              />


              <small className="character-count">
                {bio.length}/1000
              </small>

            </label>

          </div>


          {/* ================================
              FUNDING
          ================================= */}

          <div className="form-section">

            <span className="section-kicker">
              SUPPORT
            </span>


            <h2>
              Give people a way to help.
            </h2>


            <label>

              Donation goal


              <div className="input-with-suffix">

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={goal}
                  onChange={(event) =>
                    setGoal(
                      event.target.value
                    )
                  }
                  required
                />


                <span>
                  ETH
                </span>

              </div>

            </label>


            <label>

              Public wallet address


              <input
                value={wallet}
                onChange={(event) =>
                  setWallet(
                    event.target.value
                  )
                }
                placeholder="0x..."
                required
              />


              <small>
                This wallet address will
                be publicly visible and is
                where supporters send ETH.
                Donate Dreams does not
                hold the funds.
              </small>

            </label>

          </div>


          {/* ================================
              PUBLISH
          ================================= */}

          <div className="dream-form-footer">

            <div>

              <strong>
                Ready to share?
              </strong>


              <span>
                No account required.
                Your dream will be public.
              </span>

            </div>


            <button
              type="submit"
              className="glass-button primary"
            >
              Publish Dream
              <span>
                →
              </span>
            </button>

          </div>


        </form>

      </GlassCard>

    </div>

  );

};


export default EarningHope;

