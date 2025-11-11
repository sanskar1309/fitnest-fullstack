import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    // Use the admin API to list users (proper server-side method)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      // Log the error for debugging
      console.error('check-user API error:', (error as any).message || error);
      return res.status(500).json({ error: 'Failed to check user existence' });
    }

    // Check if email exists in the users list
    const exists = data.users.some(user => user.email?.toLowerCase() === normalizedEmail);

    return res.status(200).json({ exists });
  } catch (error) {
    console.error('check-user unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
