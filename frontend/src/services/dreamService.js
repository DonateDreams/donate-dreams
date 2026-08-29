import { supabase } from '../lib/supabase';

const getNumericAmount = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value !== 'string') {
    return 0;
  }

  const cleaned = value
    .replace(/ETH/gi, '')
    .replace(/,/g, '')
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
};


/*
 * Convert Supabase's snake_case fields
 * into the shape the existing V9 UI expects.
 */
const normalizeDream = (dream) => {
  if (!dream) {
    return null;
  }

  const goal = getNumericAmount(dream.goal);

  return {
    ...dream,

    id: dream.id,

    name: String(dream.name || '').trim(),

    username: String(dream.username || '').trim(),

    bio: String(dream.bio || '').trim(),

    title:
      dream.title ||
      dream.name ||
      'Untitled Dream',

    description:
      dream.description ||
      dream.bio ||
      '',

    goal: goal.toFixed(4),

    /*
     * Donations will eventually determine
     * the real raised amount.
     *
     * For now, newly created dreams start
     * at zero.
     */
    raised: '0.0000',

    currentAmount: '0.0000',

    wallet: String(dream.wallet || '').trim(),

    category:
      dream.category ||
      'Other',

    avatarSeed:
      dream.avatar_seed ||
      dream.username ||
      dream.name ||
      'dream',

    createdAt:
      dream.created_at,

    updatedAt:
      dream.updated_at,
  };
};


/*
 * ========================================
 * GET ALL DREAMS
 * ========================================
 */

export const getDreams = async () => {
  const {
    data,
    error,
  } = await supabase
    .from('dreams')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    console.error(
      'Unable to load dreams:',
      error
    );

    throw error;
  }

  return Array.isArray(data)
    ? data.map(normalizeDream)
    : [];
};


/*
 * ========================================
 * GET PUBLIC DREAMS
 * ========================================
 */

export const getPublicDreams = async () => {
  return getDreams();
};


/*
 * ========================================
 * CREATE DREAM
 * ========================================
 */

export const createDream = async (
  dreamData
) => {
  if (
    !dreamData ||
    typeof dreamData !== 'object'
  ) {
    throw new Error(
      'Invalid dream data.'
    );
  }

  const name =
    String(
      dreamData.name || ''
    ).trim();

  const bio =
    String(
      dreamData.bio || ''
    ).trim();

  const username =
    String(
      dreamData.username || ''
    ).trim();

  const wallet =
    String(
      dreamData.wallet ||
      dreamData.walletAddress ||
      ''
    ).trim();

  const goal =
    getNumericAmount(
      dreamData.goal
    );

  if (bio.length < 20) {
    throw new Error(
      'Please tell your story in at least 20 characters.'
    );
  }

  if (goal <= 0) {
    throw new Error(
      'Please enter a donation goal greater than zero.'
    );
  }

  if (!wallet) {
    throw new Error(
      'Please provide a wallet address so supporters know where to send funds.'
    );
  }

  const now =
    new Date().toISOString();

  const dreamDataForDatabase = {
    name,

    username,

    bio,

    title:
      dreamData.title ||
      name ||
      'Untitled Dream',

    description:
      dreamData.description ||
      bio,

    goal:
      goal.toFixed(4),

    wallet,

    category:
      dreamData.category ||
      'Other',

    avatar_seed:
      dreamData.avatarSeed ||
      username ||
      name ||
      'dream',

    created_at:
      now,

    updated_at:
      now,
  };

  const {
    data,
    error,
  } = await supabase
    .from('dreams')
    .insert(
      dreamDataForDatabase
    )
    .select()
    .single();

  if (error) {
    console.error(
      'Unable to create dream:',
      error
    );

    throw error;
  }

  const dream =
    normalizeDream(data);

  window.dispatchEvent(
    new CustomEvent(
      'donateDreams:dreamCreated',
      {
        detail: dream,
      }
    )
  );

  return dream;
};


/*
 * ========================================
 * GET DREAM BY ID
 * ========================================
 */

export const getDreamById = async (
  dreamId
) => {
  if (!dreamId) {
    return null;
  }

  const {
    data,
    error,
  } = await supabase
    .from('dreams')
    .select('*')
    .eq('id', dreamId)
    .maybeSingle();

  if (error) {
    console.error(
      'Unable to load dream:',
      error
    );

    throw error;
  }

  return normalizeDream(data);
};


/*
 * ========================================
 * UPDATE DREAM
 * ========================================
 */

export const updateDream = async (
  dreamId,
  updates
) => {
  if (!dreamId) {
    throw new Error(
      'Dream ID is required.'
    );
  }

  const databaseUpdates = {};

  if (
    updates.name !== undefined
  ) {
    databaseUpdates.name =
      String(
        updates.name || ''
      ).trim();
  }

  if (
    updates.username !== undefined
  ) {
    databaseUpdates.username =
      String(
        updates.username || ''
      ).trim();
  }

  if (
    updates.bio !== undefined
  ) {
    databaseUpdates.bio =
      String(
        updates.bio || ''
      ).trim();
  }

  if (
    updates.title !== undefined
  ) {
    databaseUpdates.title =
      updates.title;
  }

  if (
    updates.description !== undefined
  ) {
    databaseUpdates.description =
      updates.description;
  }

  if (
    updates.goal !== undefined
  ) {
    databaseUpdates.goal =
      getNumericAmount(
        updates.goal
      ).toFixed(4);
  }

  if (
    updates.wallet !== undefined ||
    updates.walletAddress !== undefined
  ) {
    databaseUpdates.wallet =
      String(
        updates.wallet ||
        updates.walletAddress ||
        ''
      ).trim();
  }

  if (
    updates.category !== undefined
  ) {
    databaseUpdates.category =
      updates.category;
  }

  if (
    updates.avatarSeed !== undefined
  ) {
    databaseUpdates.avatar_seed =
      updates.avatarSeed;
  }

  databaseUpdates.updated_at =
    new Date().toISOString();

  const {
    data,
    error,
  } = await supabase
    .from('dreams')
    .update(
      databaseUpdates
    )
    .eq('id', dreamId)
    .select()
    .single();

  if (error) {
    console.error(
      'Unable to update dream:',
      error
    );

    throw error;
  }

  const dream =
    normalizeDream(data);

  window.dispatchEvent(
    new CustomEvent(
      'donateDreams:dreamUpdated',
      {
        detail: dream,
      }
    )
  );

  return dream;
};


/*
 * ========================================
 * DELETE DREAM
 * ========================================
 */

export const deleteDream = async (
  dreamId
) => {
  if (!dreamId) {
    return false;
  }

  const {
    error,
  } = await supabase
    .from('dreams')
    .delete()
    .eq('id', dreamId);

  if (error) {
    console.error(
      'Unable to delete dream:',
      error
    );

    throw error;
  }

  window.dispatchEvent(
    new CustomEvent(
      'donateDreams:dreamDeleted',
      {
        detail: {
          dreamId,
        },
      }
    )
  );

  return true;
};


/*
 * ========================================
 * LEGACY COMPATIBILITY
 * ========================================
 */

export const getDreamsByUserId = () => {
  return [];
};

