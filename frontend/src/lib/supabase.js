import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://louskjcamsiasiraluco.supabase.co';

const supabasePublishableKey =
  'sb_publishable_QCedYeMV0TktpwcsugjtBQ_sBFsg9Ap';

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);