import "dotenv/config";
import { Pool } from "pg";
import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";

async function main() {
  const email = "hs@hs.de";
  const plainPassword = "123456";
  const role = "user";

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Create a .env file from .env.example.");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    // Check if user exists
    const existing = await pool.query(`SELECT id, email FROM users WHERE email = $1 LIMIT 1`, [email]);
    if (existing.rowCount && existing.rows[0]) {
      console.log(`✅ User already exists: ${existing.rows[0].email} (id: ${existing.rows[0].id})`);
      return;
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const id = nanoid();

    await pool.query(
      `INSERT INTO users (id, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [id, email, passwordHash, role],
    );

    console.log(`✅ Seeded user: ${email}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
