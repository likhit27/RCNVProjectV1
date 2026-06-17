// IMPORTANT: Storing database credentials in source is insecure. Prefer env vars.
// This file is a fallback when DATABASE_URL / DIRECT_URL env vars are not set.

const config = {
  // Supabase connection pooler — IPv6-compatible, for Vercel serverless (port 6543, transaction mode)
  databaseUrl: 'postgresql://postgres.bbkfennkpfhwsjryrdzv:RCNVProjectV11@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true',

  // Direct connection — for local migrations (prisma db push / seed)
  directUrl: 'postgresql://postgres:RCNVProjectV11@db.bbkfennkpfhwsjryrdzv.supabase.co:5432/postgres?sslmode=require',
};

export default config;
