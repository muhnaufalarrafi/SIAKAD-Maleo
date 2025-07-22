// src/config/db.js
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ override: true });

// PostgreSQL connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// PostgreSQL query helper
export const query = (text, params) => pool.query(text, params);

// Supabase client (optional)
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);
