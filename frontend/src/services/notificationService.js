const NOTIFICATIONS_KEY =
  'donateDreams_notifications';

const readNotifications = () => {
  try {
    const stored =
      localStorage.getItem(
        NOTIFICATIONS_KEY
      );

    return stored
      ? JSON.parse(stored)
      : [];
  } catch (error) {
    console.error(
      'Unable to read notifications:',
      error
    );

    return [];
  }
};

const saveNotifications = (
  notifications
) => {
  localStorage.setItem(
    NOTIFICATIONS_KEY,
    JSON.stringify(
      notifications
    )
  );
};

const generateId = () => {
  if (
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return (
    Date.now() +
    '-' +
    Math.random()
      .toString(36)
      .slice(2)
  );
};

export const createNotification = ({
  userId,
  type,
  title,
  message,
  dreamId = null,
}) => {
  const notification = {
    id: generateId(),

    userId,

    type,

    title,

    message,

    dreamId,

    read: false,

    createdAt:
      new Date().toISOString(),
  };

  const notifications =
    readNotifications();

  notifications.unshift(
    notification
  );

  saveNotifications(
    notifications.slice(0, 100)
  );

  return notification;
};

export const getUserNotifications = (
  userId
) => {
  return readNotifications()
    .filter(
      (notification) =>
        notification.userId ===
        userId
    );
};

export const getUnreadCount = (
  userId
) => {
  return getUserNotifications(
    userId
  ).filter(
    (notification) =>
      !notification.read
  ).length;
};

export const markNotificationRead = (
  notificationId
) => {
  const notifications =
    readNotifications();

  const updated =
    notifications.map(
      (notification) =>
        notification.id ===
        notificationId
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

  saveNotifications(
    updated
  );
};

export const markAllNotificationsRead = (
  userId
) => {
  const notifications =
    readNotifications();

  const updated =
    notifications.map(
      (notification) =>
        notification.userId === userId
          ? {
              ...notification,
              read: true,
            }
          : notification
    );

  saveNotifications(
    updated
  );
};