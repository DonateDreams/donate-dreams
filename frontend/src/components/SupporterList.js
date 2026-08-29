import React from 'react';

const shortenAddress = (
  address
) => {
  if (!address) {
    return '';
  }

  if (address.length < 12) {
    return address;
  }

  return (
    address.slice(0, 6) +
    '...' +
    address.slice(-4)
  );
};

const SupporterList = ({
  donations = [],
}) => {
  const sorted =
    [...donations].sort(
      (a, b) =>
        Number(b.amount) -
        Number(a.amount)
    );

  if (!sorted.length) {
    return (
      <div className="supporter-empty">
        <span>◇</span>

        <p>
          No supporters yet.
        </p>

        <small>
          Be the first person to
          help this dream move
          forward.
        </small>
      </div>
    );
  }

  return (
    <div className="supporter-list">
      {sorted.map(
        (
          donation,
          index
        ) => (
          <div
            className="supporter-item"
            key={
              donation.id ||
              index
            }
          >
            <div className="supporter-rank">
              {index === 0
                ? '✦'
                : String(
                    index + 1
                  ).padStart(
                    2,
                    '0'
                  )}
            </div>

            <div className="supporter-identity">
              <strong>
                {donation.donorUsername ||
                  'Anonymous'}
              </strong>

              {donation.walletAddress && (
                <small>
                  {shortenAddress(
                    donation.walletAddress
                  )}
                </small>
              )}
            </div>

            <strong className="supporter-amount">
              +
              {Number(
                donation.amount
              ).toFixed(4)}
              {' '}
              ETH
            </strong>
          </div>
        )
      )}
    </div>
  );
};

export default SupporterList;