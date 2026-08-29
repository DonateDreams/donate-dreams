import React, {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import GlassCard from '../components/GlassCard';
import DreamCard from '../components/DreamCard';
import DreamConstellation from '../components/DreamConstellation';
import DreamDetailModal from '../components/DreamDetailModal';
import ActivityFeed from '../components/ActivityFeed';

import {
  getDreams,
} from '../services/dreamService';

import {
  getActivity,
} from '../services/activityService';


const Home = ({
  user,
}) => {

  const navigate = useNavigate();


  /*
   * ========================================
   * DREAM STATE
   * ========================================
   */

  const [
    dreams,
    setDreams,
  ] = useState([]);

  const [
    selectedDream,
    setSelectedDream,
  ] = useState(null);


  /*
   * ========================================
   * ACTIVITY STATE
   * ========================================
   */

  const [
    activity,
    setActivity,
  ] = useState([]);


  /*
   * ========================================
   * LOAD DATA
   * ========================================
   */

  useEffect(() => {

    const loadData = async () => {

      try {

        const loadedDreams =
          await getDreams();

        setDreams(
          Array.isArray(loadedDreams)
            ? loadedDreams
            : []
        );

      } catch (error) {

        console.error(
          'Unable to load dreams:',
          error
        );

        setDreams([]);

      }


      try {

        const loadedActivity =
          getActivity();

        setActivity(
          Array.isArray(loadedActivity)
            ? loadedActivity.slice(0, 8)
            : []
        );

      } catch (error) {

        console.error(
          'Unable to load activity:',
          error
        );

        setActivity([]);

      }

    };


    loadData();

  }, []);


  /*
   * ========================================
   * DREAM SELECTION
   * ========================================
   */

  const handleDreamSelect = (
    dream
  ) => {

    setSelectedDream(
      dream
    );

  };


  /*
   * ========================================
   * CLOSE DREAM MODAL
   * ========================================
   */

  const handleCloseDream = () => {

    setSelectedDream(
      null
    );

  };


  /*
   * ========================================
   * SUPPORT DREAM
   * ========================================
   */

  const handleDonate = (
    dream
  ) => {

    setSelectedDream(
      null
    );

    navigate(
      '/donate',
      {
        state: {
          dream,
        },
      }
    );

  };


  /*
   * ========================================
   * FEATURED DREAMS
   * ========================================
   */

  const featuredDreams =
    dreams.slice(
      0,
      3
    );


  /*
   * ========================================
   * HOME
   * ========================================
   */

  return (

    <div className="page">


      {/* ==================================
          HERO
      ================================== */}

      <section className="hero-section">

        <div className="hero-copy">

          <div className="eyebrow">

            <span className="pulse-dot" />

            THE FUTURE OF GIVING

          </div>


          <h1>

            Dreams are

            <br />

            <span className="gradient-text">
              worth supporting.
            </span>

          </h1>


          <p>

            Donate Dreams connects people
            with goals, ambitions and dreams
            to people who want to help make
            them possible.

          </p>


          <div className="hero-actions">

            <Link
              to="/supportcreator"
              className="glass-button primary"
            >

              Discover Dreams

              <span>
                →
              </span>

            </Link>


            {/* 
             * IMPORTANT:
             *
             * There is currently NO /signuplogin
             * route in App.js.
             *
             * Therefore both logged-in and
             * logged-out users are sent to the
             * existing dream creation page.
             */}

            <Link
              to="/earninghope"
              className="glass-button secondary"
            >

              {user
                ? 'Share Your Dream'
                : 'Create Your Dream'
              }

            </Link>

          </div>


          <div className="hero-stats">

            <div>

              <strong>
                100%
              </strong>

              <span>
                Peer-to-peer
              </span>

            </div>


            <div>

              <strong>
                0%
              </strong>

              <span>
                Platform fee in V1
              </span>

            </div>


            <div>

              <strong>
                Web3
              </strong>

              <span>
                Wallet powered
              </span>

            </div>

          </div>

        </div>


        {/* ==================================
            HERO VISUAL
        ================================== */}

        <div className="hero-visual">

          <div className="orb orb-one" />

          <div className="orb orb-two" />

          <div className="orb orb-three" />


          <GlassCard
            className="floating-dream-card"
          >

            <div className="mini-card-header">

              <span>
                ✦
              </span>

              <span>
                DREAM DISCOVERED
              </span>

            </div>


            <div className="floating-heart">
              ♡
            </div>


            <h3>

              Someone's dream
              could use you.

            </h3>


            <p>

              Sometimes a small act
              of kindness is enough to
              change someone's path.

            </p>


            <div className="fake-progress">

              <span />

            </div>


            <small>

              Every contribution matters.

            </small>

          </GlassCard>

        </div>

      </section>


      {/* ==================================
          DREAM CONSTELLATION
      ================================== */}

      <section className="section constellation-section">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              DREAM NETWORK
            </span>

            <h2>
              Find a dream worth supporting
            </h2>

            <p>

              Every node represents someone
              working toward something they
              believe in.

            </p>

          </div>


          <Link
            to="/supportcreator"
            className="text-link"
          >
            Explore all →
          </Link>

        </div>


        {dreams.length > 0 ? (

          <DreamConstellation
            dreams={
              dreams.slice(
                0,
                12
              )
            }
            onSelect={
              handleDreamSelect
            }
          />

        ) : (

          <GlassCard
            className="empty-state-card"
          >

            <div className="activity-empty">

              <span>
                ◇
              </span>

              <p>

                Dreams are waiting to
                enter the network.

              </p>

            </div>

          </GlassCard>

        )}

      </section>


      {/* ==================================
          FEATURED DREAMS
      ================================== */}

      <section className="section">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              EXPLORE
            </span>

            <h2>
              Dreams waiting for you
            </h2>

          </div>


          <Link
            to="/supportcreator"
            className="text-link"
          >
            View all →
          </Link>

        </div>


        {featuredDreams.length > 0 ? (

          <div className="dream-grid">

            {featuredDreams.map(
              (
                dream
              ) => (

                <DreamCard
                  key={
                    dream.id
                  }
                  dream={
                    dream
                  }
                />

              )
            )}

          </div>

        ) : (

          <GlassCard
            className="empty-state-card"
          >

            <div className="activity-empty">

              <span>
                ✧
              </span>

              <p>

                No dreams have been
                created yet.

              </p>

            </div>

          </GlassCard>

        )}

      </section>


      {/* ==================================
          COMMUNITY ACTIVITY
      ================================== */}

      <section className="section activity-section">

        <div className="section-heading">

          <div>

            <span className="section-kicker">
              LIVE COMMUNITY
            </span>

            <h2>
              What's happening
            </h2>

          </div>

        </div>


        <GlassCard
          className="activity-card"
        >

          <ActivityFeed
            items={
              activity
            }
          />

        </GlassCard>

      </section>


      {/* ==================================
          HOW IT WORKS
      ================================== */}

      <section className="how-section">

        <div className="section-heading centered">

          <span className="section-kicker">
            HOW IT WORKS
          </span>

          <h2>
            Simple by design.
          </h2>

          <p>

            No complicated fundraising
            machinery. Just people,
            dreams and direct support.

          </p>

        </div>


        <div className="steps-grid">


          <GlassCard
            className="step-card"
          >

            <div className="step-number">
              01
            </div>

            <h3>
              Create your dream
            </h3>

            <p>

              Tell the community who
              you are, what you're trying
              to accomplish and where
              support can help.

            </p>

          </GlassCard>


          <GlassCard
            className="step-card"
          >

            <div className="step-number">
              02
            </div>

            <h3>
              Get discovered
            </h3>

            <p>

              Your dream can be displayed
              alongside other people looking
              for a little bit of hope.

            </p>

          </GlassCard>


          <GlassCard
            className="step-card"
          >

            <div className="step-number">
              03
            </div>

            <h3>
              Receive support
            </h3>

            <p>

              Supporters can send crypto
              directly to the wallet address
              you provide.

            </p>

          </GlassCard>


        </div>

      </section>


      {/* ==================================
          FINAL CTA
      ================================== */}

      <section className="cta-section">

        <GlassCard
          className="cta-card"
        >

          <div>

            <span className="section-kicker">
              YOUR STORY MATTERS
            </span>

            <h2>
              What are you dreaming about?
            </h2>

            <p>

              You never know who might be
              willing to help.

            </p>

          </div>


          {/* 
           * FIXED:
           *
           * The old code sent logged-out
           * users to /signuplogin.
           *
           * App.js has no such route.
           *
           * The current app uses /earninghope
           * as the dream creation page.
           */}

          <Link
            to="/earninghope"
            className="glass-button primary"
          >

            {user
              ? 'Start Your Journey'
              : 'Start Your Journey'
            }

            <span>
              →
            </span>

          </Link>

        </GlassCard>

      </section>


      {/* ==================================
          DREAM DETAIL MODAL
      ================================== */}

      <DreamDetailModal
        dream={
          selectedDream
        }
        onClose={
          handleCloseDream
        }
        onDonate={
          handleDonate
        }
      />


    </div>

  );

};


export default Home;

