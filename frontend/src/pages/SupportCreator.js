import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import GlassCard from '../components/GlassCard';

import DreamDetailModal from '../components/DreamDetailModal';

import {
  getPublicDreams,
} from '../services/dreamService';

import {
  getDreamTotal,
} from '../services/donationService';

import {
  isValidAddress,
} from '../services/walletService';


const SupportCreator = ({
  user = null,
}) => {

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  const [
    search,
    setSearch,
  ] = useState('');


  const [
    selectedDream,
    setSelectedDream,
  ] = useState(null);


  const [
    refresh,
    setRefresh,
  ] = useState(0);


  const [
    dreams,
    setDreams,
  ] = useState([]);


  const [
    dreamTotals,
    setDreamTotals,
  ] = useState({});


  /*
   * ========================================
   * LOAD DREAMS FROM SUPABASE
   * ========================================
   */

  useEffect(() => {

    let mounted = true;


    const loadDreams =
      async () => {

        try {

          const loadedDreams =
            await getPublicDreams();


          if (!mounted) {
            return;
          }


          setDreams(
            Array.isArray(
              loadedDreams
            )
              ? loadedDreams
              : []
          );

        } catch (error) {

          console.error(
            'Unable to load public dreams:',
            error
          );


          if (mounted) {

            setDreams([]);
          }
        }
      };


    loadDreams();


    return () => {

      mounted = false;

    };

  }, [refresh]);


  /*
   * ========================================
   * LOAD DONATION TOTALS FROM SUPABASE
   * ========================================
   */

  useEffect(() => {

    let mounted = true;


    const loadDonationTotals =
      async () => {

        const totals = {};


        for (
          const dream of dreams
        ) {

          try {

            totals[dream.id] =
              await getDreamTotal(
                dream.id
              );

          } catch (error) {

            console.error(
              'Unable to load donation total:',
              error
            );

            totals[dream.id] = 0;
          }
        }


        if (mounted) {

          setDreamTotals(
            totals
          );
        }
      };


    if (
      dreams.length > 0
    ) {

      loadDonationTotals();

    } else {

      setDreamTotals({});
    }


    return () => {

      mounted = false;

    };

  }, [dreams]);


  /*
   * ========================================
   * OPEN DREAM FROM URL
   * ========================================
   *
   * /supportcreator?dream=abc
   */

  useEffect(() => {

    const dreamId =
      searchParams.get(
        'dream'
      );


    if (!dreamId) {

      setSelectedDream(
        null
      );

      return;
    }


    const dream =
      dreams.find(
        (item) =>
          item.id ===
          dreamId
      );


    if (dream) {

      setSelectedDream(
        dream
      );

    } else {

      setSelectedDream(
        null
      );
    }

  }, [
    searchParams,
    dreams,
  ]);


  /*
   * ========================================
   * FILTER DREAMS
   * ========================================
   */

  const filteredDreams =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();


      if (!query) {

        return dreams;
      }


      return dreams.filter(
        (dream) =>

          (dream.name || '')
            .toLowerCase()
            .includes(query) ||

          (dream.username || '')
            .toLowerCase()
            .includes(query) ||

          (dream.bio || '')
            .toLowerCase()
            .includes(query) ||

          (dream.category || '')
            .toLowerCase()
            .includes(query)
      );

    }, [
      dreams,
      search,
    ]);


  /*
   * ========================================
   * OPEN DREAM
   * ========================================
   */

  const openDream =
    (dream) => {

      setSelectedDream(
        dream
      );


      navigate(
        `/supportcreator?dream=${encodeURIComponent(
          dream.id
        )}`
      );
    };


  /*
   * ========================================
   * CLOSE DREAM
   * ========================================
   */

  const closeDream =
    () => {

      setSelectedDream(
        null
      );


      navigate(
        '/supportcreator'
      );
    };


  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (
    <div className="page">

      <section className="account-header">

        <div>

          <span className="section-kicker">
            SUPPORT DREAMS
          </span>

          <h1>
            Find a dream worth supporting.
          </h1>

          <p>
            Browse dreams and choose someone
            you'd like to support.
          </p>

        </div>


        <Link
          to="/earninghope"
          className="glass-button primary"
        >
          Create a Dream

          <span>
            →
          </span>

        </Link>

      </section>


      <GlassCard className="dream-form-card">

        <label>

          Search dreams

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by name, username, story, or category..."
          />

        </label>

      </GlassCard>


      <div className="dream-grid">

        {filteredDreams.length === 0 ? (

          <GlassCard className="account-info-card">

            <span className="section-kicker">
              NO DREAMS FOUND
            </span>

            <h2>
              Nothing matches your search.
            </h2>

            <p>
              Try a different search or
              create your own dream.
            </p>

          </GlassCard>

        ) : (

          filteredDreams.map(
            (dream) => {

              const wallet =
                dream.wallet ||
                dream.walletAddress ||
                '';


              const validWallet =
                isValidAddress(
                  wallet
                );


              const goal =
                Number(
                  dream.goal
                ) || 0;


              /*
               * IMPORTANT:
               *
               * getDreamTotal() is async,
               * so the value comes from
               * dreamTotals instead of
               * calling it directly here.
               */

              const raised =
                Number(
                  dreamTotals[
                    dream.id
                  ]
                ) ||
                Number(
                  dream.raised
                ) ||
                0;


              const percentage =
                goal > 0
                  ? Math.min(
                      100,
                      (
                        raised /
                        goal
                      ) *
                      100
                    )
                  : 0;


              return (
                <GlassCard
                  key={
                    dream.id
                  }
                  className="dream-card"
                >

                  <span className="section-kicker">

                    {dream.category ||
                      'OTHER'}

                  </span>


                  <h2>

                    {dream.name ||
                      dream.accountName ||
                      dream.username}

                  </h2>


                  <p className="username">

                    @{dream.username ||
                      'creator'}

                  </p>


                  <p className="profile-bio">

                    {dream.bio ||
                      'No story provided yet.'}

                  </p>


                  <div className="dream-card-stats">

                    <div>

                      <span>
                        GOAL
                      </span>

                      <strong>

                        {goal.toFixed(
                          2
                        )}

                        {' '}

                        ETH

                      </strong>

                    </div>


                    <div>

                      <span>
                        RAISED
                      </span>

                      <strong>

                        {raised.toFixed(
                          4
                        )}

                        {' '}

                        ETH

                      </strong>

                    </div>

                  </div>


                  <div className="dream-progress">

                    <div className="progress-label">

                      <span>

                        {percentage.toFixed(
                          0
                        )}

                        % funded

                      </span>


                      <span>

                        {goal.toFixed(
                          2
                        )}

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

                  </div>


                  <div className="button-row">

                    <button
                      type="button"
                      className="glass-button primary"
                      onClick={() =>
                        openDream(
                          dream
                        )
                      }
                    >

                      {validWallet
                        ? 'Support Dream'
                        : 'View Dream'}

                      <span>
                        →
                      </span>

                    </button>

                  </div>


                  {!validWallet && (

                    <small className="wallet-warning">

                      This creator has not
                      provided a valid wallet
                      address yet.

                    </small>

                  )}

                </GlassCard>
              );

            }
          )

        )}

      </div>


      {selectedDream && (

        <DreamDetailModal
          dream={
            selectedDream
          }
          user={user}
          onClose={
            closeDream
          }
        />

      )}

    </div>
  );
};


export default SupportCreator;

