import React, {
  useEffect,
  useState,
} from 'react';

import {
  getUserNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';

const NotificationCenter = ({
  user,
}) => {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const refresh = () => {
    if (!user) {
      return;
    }

    setNotifications(
      getUserNotifications(
        user.id
      )
    );
  };

  useEffect(() => {
    refresh();
  }, [user]);

  if (!user) {
    return null;
  }

  const unread =
    getUnreadCount(
      user.id
    );

  return (
    <div className="notification-center">

      <button
        type="button"
        className="notification-button"
        onClick={() => {
          setOpen(
            !open
          );

          refresh();
        }}
        aria-label="Notifications"
      >
        <span>
          ◇
        </span>

        {unread > 0 && (
          <b>
            {unread > 9
              ? '9+'
              : unread}
          </b>
        )}
      </button>

      {open && (
        <div className="notification-panel">

          <div className="notification-header">
            <div>
              <span className="section-kicker">
                SIGNALS
              </span>

              <h3>
                Notifications
              </h3>
            </div>

            {unread > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllNotificationsRead(
                    user.id
                  );

                  refresh();
                }}
              >
                Mark read
              </button>
            )}
          </div>

          <div className="notification-list">

            {!notifications.length ? (
              <div className="notification-empty">
                <span>
                  ◌
                </span>

                <p>
                  No new signals.
                </p>
              </div>
            ) : (
              notifications.map(
                (
                  notification
                ) => (
                  <button
                    type="button"
                    className={
                      notification.read
                        ? 'notification-item'
                        : 'notification-item unread'
                    }
                    key={
                      notification.id
                    }
                    onClick={() => {
                      markNotificationRead(
                        notification.id
                      );

                      refresh();
                    }}
                  >
                    <span className="notification-item-icon">
                      ✦
                    </span>

                    <span>
                      <strong>
                        {
                          notification.title
                        }
                      </strong>

                      <small>
                        {
                          notification.message
                        }
                      </small>
                    </span>
                  </button>
                )
              )
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default NotificationCenter;