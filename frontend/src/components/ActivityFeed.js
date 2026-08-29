import React from 'react';

const icons = {
  donation: '✦',
  milestone: '◇',
  dream: '✧',
  system: '⌁',
};

const ActivityFeed = ({
  items = [],
}) => {
  if (!items.length) {
    return (
      <div className="activity-empty">
        <span>◌</span>

        <p>
          No activity yet.
        </p>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      {items.map(
        (item) => (
          <div
            className="activity-item"
            key={item.id}
          >
            <div className="activity-icon">
              {icons[item.type] ||
                icons.system}
            </div>

            <div className="activity-content">
              <strong>
                {item.title}
              </strong>

              <p>
                {item.description}
              </p>

              <small>
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </small>
            </div>

            {item.amount && (
              <strong className="activity-amount">
                +
                {Number(
                  item.amount
                ).toFixed(4)}
                {' '}
                ETH
              </strong>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ActivityFeed;