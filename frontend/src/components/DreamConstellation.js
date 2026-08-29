import React from 'react';


const DreamConstellation = ({
  dreams = [],
  onSelect,
}) => {

  const safeDreams = Array.isArray(dreams)
    ? dreams.slice(0, 12)
    : [];


  /*
   * ========================================
   * EMPTY STATE
   * ========================================
   */

  if (safeDreams.length === 0) {

    return (
      <div className="dream-constellation">

        <div className="constellation-grid" />

        <div className="constellation-core">

          <span>
            DREAM
          </span>

          <strong>
            NETWORK
          </strong>

        </div>

      </div>
    );

  }


  /*
   * ========================================
   * NODE POSITIONING
   * ========================================
   *
   * We intentionally keep the nodes inside
   * the safe 16%–84% area so they don't get
   * clipped on smaller screens.
   */

  const getNodePosition = (index) => {

    const total =
      safeDreams.length;

    /*
     * Use a slightly irregular orbital
     * pattern instead of perfectly spaced
     * nodes.
     */

    const angle =
      (index / total) *
      Math.PI *
      2 -
      Math.PI / 2;

    const ring =
      index % 3;

    const radius =
      ring === 0
        ? 29
        : ring === 1
          ? 35
          : 40;

    let x =
      50 +
      Math.cos(angle) *
      radius;

    let y =
      50 +
      Math.sin(angle) *
      radius;


    /*
     * Keep nodes away from the extreme
     * edges of the container.
     */

    x = Math.max(
      13,
      Math.min(
        87,
        x
      )
    );

    y = Math.max(
      14,
      Math.min(
        86,
        y
      )
    );


    return {
      x,
      y,
    };

  };


  /*
   * ========================================
   * DREAM VALUE
   * ========================================
   */

  const getProgress = (
    dream
  ) => {

    const value =
      Number(
        dream?.currentAmount ??
        dream?.totalEarned ??
        dream?.raised ??
        dream?.amountRaised ??
        0
      );

    return Number.isFinite(value)
      ? value
      : 0;

  };


  /*
   * ========================================
   * DREAM TITLE
   * ========================================
   */

  const getTitle = (
    dream
  ) => {

    return (
      dream?.title ||
      dream?.name ||
      'Dream'
    );

  };


  /*
   * ========================================
   * FORMAT AMOUNT
   * ========================================
   */

  const formatAmount = (
    amount
  ) => {

    if (
      !Number.isFinite(
        amount
      )
    ) {
      return '0';
    }

    if (
      amount >= 1000000
    ) {

      return (
        `${(
          amount /
          1000000
        ).toFixed(1)}M`
      );

    }

    if (
      amount >= 1000
    ) {

      return (
        `${(
          amount /
          1000
        ).toFixed(1)}K`
      );

    }

    return amount.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );

  };


  /*
   * ========================================
   * RENDER
   * ========================================
   */

  return (

    <div
      className="dream-constellation"
      aria-label="Dream network"
    >

      {/* ==================================
          BACKGROUND GRID
      ================================== */}

      <div
        className="constellation-grid"
        aria-hidden="true"
      />


      {/* ==================================
          ATMOSPHERE
      ================================== */}

      <div
        className="constellation-atmosphere"
        aria-hidden="true"
      />

      <div
        className="constellation-ring constellation-ring-one"
        aria-hidden="true"
      />

      <div
        className="constellation-ring constellation-ring-two"
        aria-hidden="true"
      />

      <div
        className="constellation-ring constellation-ring-three"
        aria-hidden="true"
      />


      {/* ==================================
          CENTER
      ================================== */}

      <div
        className="constellation-core"
      >

        <div
          className="core-aura"
          aria-hidden="true"
        />

        <div
          className="core-symbol"
          aria-hidden="true"
        >
          ◇
        </div>

        <span>
          DREAM
        </span>

        <strong>
          NETWORK
        </strong>

        <small>
          {safeDreams.length}
          {' '}
          {safeDreams.length === 1
            ? 'dream'
            : 'dreams'}
        </small>

      </div>


      {/* ==================================
          CONNECTION LINES
      ================================== */}

      <div
        className="constellation-connections"
        aria-hidden="true"
      >

        {safeDreams.map(
          (
            dream,
            index
          ) => {

            const {
              x,
              y,
            } =
              getNodePosition(
                index
              );

            return (
              <div
                key={
                  `connection-${dream.id || index}`
                }
                className="constellation-connection"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${Math.sqrt(
                    Math.pow(
                      x - 50,
                      2
                    ) +
                    Math.pow(
                      y - 50,
                      2
                    )
                  )}%`,
                  transform: `
                    rotate(
                      ${Math.atan2(
                        y - 50,
                        x - 50
                      )}rad
                    )
                  `,
                }}
              />
            );

          }
        )}

      </div>


      {/* ==================================
          DREAM NODES
      ================================== */}

      {safeDreams.map(
        (
          dream,
          index
        ) => {

          const {
            x,
            y,
          } =
            getNodePosition(
              index
            );

          const progress =
            getProgress(
              dream
            );

          const title =
            getTitle(
              dream
            );


          return (

            <button
              type="button"
              key={
                dream.id ||
                `dream-${index}`
              }
              className="constellation-node"
              style={{
                left:
                  `${x}%`,
                top:
                  `${y}%`,
                '--node-delay':
                  `${index * 0.12}s`,
              }}
              onClick={() => {

                if (
                  typeof onSelect ===
                  'function'
                ) {

                  onSelect(
                    dream
                  );

                }

              }}
              aria-label={
                `View dream: ${title}`
              }
            >

              <span
                className="node-orbit"
                aria-hidden="true"
              />

              <span
                className="node-glow"
                aria-hidden="true"
              />

              <span
                className="node-core"
                aria-hidden="true"
              >
                ◇
              </span>


              <span className="node-label">

                {title}

              </span>


              <small>

                {formatAmount(
                  progress
                )}

              </small>

            </button>

          );

        }
      )}


      {/* ==================================
          NETWORK STATUS
      ================================== */}

      <div
        className="constellation-status"
      >

        <span className="status-dot" />

        <span>
          LIVE DREAM NETWORK
        </span>

      </div>


    </div>

  );

};


export default DreamConstellation;

