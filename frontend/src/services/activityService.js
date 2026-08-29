const ACTIVITY_KEY =
  'donateDreams_activity';

const readActivity = () => {
  try {
    const stored =
      localStorage.getItem(
        ACTIVITY_KEY
      );

    return stored
      ? JSON.parse(stored)
      : [];
  } catch (error) {
    console.error(
      'Unable to read activity:',
      error
    );

    return [];
  }
};

const saveActivity = (
  activity
) => {
  localStorage.setItem(
    ACTIVITY_KEY,
    JSON.stringify(activity)
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

export const addActivity = ({
  userId = null,
  type,
  title,
  description,
  amount = null,
  dreamId = null,
}) => {
  const activityItem = {
    id: generateId(),

    userId,

    type,

    title,

    description,

    amount,

    dreamId,

    createdAt:
      new Date().toISOString(),
  };

  const activity =
    readActivity();

  activity.unshift(
    activityItem
  );

  saveActivity(
    activity.slice(0, 200)
  );

  return activityItem;
};

export const getActivity = (
  userId = null
) => {
  const activity =
    readActivity();

  if (!userId) {
    return activity;
  }

  return activity.filter(
    (item) =>
      item.userId === userId
  );
};

export const clearActivity = () => {
  localStorage.removeItem(
    ACTIVITY_KEY
  );
};