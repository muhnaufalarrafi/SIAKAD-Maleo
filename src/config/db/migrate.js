// src\config\db\migrate.js
import fs from 'fs';
import path from 'path';
import { query } from '../db.js';

const migrationDir = path.resolve('src/config/db/migrations');

(async () => {
  try {
    const files = fs.readdirSync(migrationDir).sort();
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
      console.log(`Running migration: ${file}`);
      await query(sql);
    }
    console.log('All migrations executed successfully ✅');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed ❌', err);
    process.exit(1);
  }
})();
