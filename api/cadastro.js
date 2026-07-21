"use strict";

// Vercel Serverless function to insert a registro into Supabase using the
// SERVICE ROLE KEY (must be set in Vercel env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return res.status(500).json({ error: 'Server misconfigured: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
  }

  const { nome, email, telefone, cidade, escolaridade, mensagem } = req.body || {};

  if (!nome || !email) {
    return res.status(400).json({ error: 'Missing required fields: nome and email' });
  }

  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/cadastros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE,
        'Authorization': `Bearer ${SERVICE_ROLE}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify([{ nome, email, telefone, cidade, escolaridade, mensagem }])
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ error: data });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



