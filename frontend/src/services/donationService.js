import { supabase } from '../lib/supabase';


const normalizeDonation = (donation) => {
  if (!donation) {
    return null;
  }

  return {
    ...donation,

    id:
      donation.id,

    dreamId:
      donation.dream_id,

    donorUserId:
      donation.donor_user_id || null,

    donorUsername:
      donation.donor_username ||
      'Anonymous',

    creatorUserId:
      donation.creator_user_id || null,

    amount:
      Number(donation.amount) || 0,

    walletAddress:
      donation.wallet_address || '',

    transactionHash:
      donation.transaction_hash || null,

    network:
      donation.network || 'Ethereum',

    status:
      donation.status || 'recorded',

    createdAt:
      donation.created_at,
  };
};


/*
 * CREATE DONATION
 */

export const createDonation = async ({
  dreamId,
  donorUserId = null,
  donorUsername = 'Anonymous',
  creatorUserId = null,
  amount,
  walletAddress = '',
  transactionHash = null,
  network = 'Ethereum',
}) => {

  const numericAmount =
    Number(amount);

  if (
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    throw new Error(
      'Donation amount must be greater than zero.'
    );
  }

  if (!dreamId) {
    throw new Error(
      'Dream ID is required.'
    );
  }

  /*
   * Matches the donations table you already
   * created in Supabase.
   */

  const payload = {
    dream_id:
      dreamId,

    donor_username:
      donorUsername ||
      'Anonymous',

    amount:
      numericAmount,

    wallet_address:
      walletAddress || null,

    transaction_hash:
      transactionHash || null,

    network:
      network || 'Ethereum',

    status:
      transactionHash
        ? 'reported'
        : 'recorded',
  };

  const {
    data,
    error,
  } =
    await supabase
      .from('donations')
      .insert(payload)
      .select()
      .single();

  if (error) {
    console.error(
      'Unable to create donation:',
      error
    );

    throw error;
  }

  const donation =
    normalizeDonation(data);

  if (
    typeof window !==
    'undefined'
  ) {
    window.dispatchEvent(
      new CustomEvent(
        'donateDreams:donationCreated',
        {
          detail:
            donation,
        }
      )
    );
  }

  return donation;
};


/*
 * GET ALL DONATIONS
 */

export const getAllDonations =
  async () => {

    const {
      data,
      error,
    } =
      await supabase
        .from('donations')
        .select('*')
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(
        'Unable to load donations:',
        error
      );

      throw error;
    }

    return Array.isArray(data)
      ? data.map(
          normalizeDonation
        )
      : [];
  };


/*
 * GET DREAM DONATIONS
 */

export const getDreamDonations =
  async (
    dreamId
  ) => {

    if (!dreamId) {
      return [];
    }

    const {
      data,
      error,
    } =
      await supabase
        .from('donations')
        .select('*')
        .eq(
          'dream_id',
          dreamId
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(
        'Unable to load dream donations:',
        error
      );

      throw error;
    }

    return Array.isArray(data)
      ? data.map(
          normalizeDonation
        )
      : [];
  };


/*
 * GET USER DONATIONS
 *
 * Your current SQL table does not have
 * donor_user_id, so return an empty list
 * until that column is intentionally added.
 */

export const getUserDonations =
  async () => {
    return [];
  };


/*
 * GET CREATOR DONATIONS
 *
 * Your current SQL table does not have
 * creator_user_id, so return an empty list
 * until the schema is intentionally expanded.
 */

export const getCreatorDonations =
  async () => {
    return [];
  };


/*
 * GET DREAM TOTAL
 */

export const getDreamTotal =
  async (
    dreamId
  ) => {

    if (!dreamId) {
      return 0;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from('donations')
        .select('amount')
        .eq(
          'dream_id',
          dreamId
        );

    if (error) {
      console.error(
        'Unable to calculate dream total:',
        error
      );

      throw error;
    }

    if (!Array.isArray(data)) {
      return 0;
    }

    return data.reduce(
      (
        total,
        donation
      ) =>
        total +
        (
          Number(
            donation.amount
          ) || 0
        ),
      0
    );
  };


/*
 * GET CREATOR TOTAL
 */

export const getCreatorTotal =
  async () => {
    return 0;
  };


/*
 * CLEAR DONATIONS
 *
 * Disabled because donations are stored
 * permanently in Supabase.
 */

export const clearDonations =
  async () => {

    console.warn(
      'clearDonations is disabled for Supabase donations.'
    );

    return false;
  };

