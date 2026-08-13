import { createClient, Client } from '@libsql/client';
import path from 'path';
import fs from 'fs';

let dbClient: Client | null = null;
let initPromise: Promise<Client> | null = null;

export function getDbClient(): Client {
  if (dbClient) {
    return dbClient;
  }

  const databaseUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (databaseUrl) {
    // Remote connection (Turso / LibSQL cloud / remote SQL)
    dbClient = createClient({
      url: databaseUrl,
      authToken: authToken || undefined,
    });
  } else {
    // Local embedded SQL database file
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        // Ignore if directory already exists
      }
    }
    const dbPath = path.join(dataDir, 'pulse.db');
    dbClient = createClient({
      url: `file:${dbPath}`,
    });
  }

  return dbClient;
}

export async function initializeDatabase(): Promise<Client> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const client = getDbClient();

    // Check if articles table needs schema upgrade
    try {
      const tableInfo = await client.execute(`PRAGMA index_list('articles')`);
      const hasUniqueSlug = tableInfo.rows.some((row: any) => String(row.name).includes('slug') && row.unique === 1);
      if (hasUniqueSlug) {
        console.log('[DB] Migrating articles schema to remove unique constraint on slug...');
        await client.execute('DROP TABLE IF EXISTS articles');
      }
    } catch (e) {
      // Table doesn't exist yet, proceed
    }

    // Create articles table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        content TEXT,
        category TEXT NOT NULL,
        source TEXT NOT NULL,
        source_url TEXT NOT NULL,
        image_url TEXT,
        published_at TEXT NOT NULL,
        published_timestamp INTEGER NOT NULL,
        tags TEXT NOT NULL,
        tickers TEXT,
        related_sources TEXT,
        read_time_minutes INTEGER NOT NULL DEFAULT 2,
        is_breaking INTEGER NOT NULL DEFAULT 0,
        is_featured INTEGER NOT NULL DEFAULT 0,
        source_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create performance indexes
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    `);
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_articles_pub_time ON articles(published_timestamp DESC);
    `);
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category, published_timestamp DESC);
    `);
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_articles_breaking ON articles(is_breaking, published_timestamp DESC);
    `);
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
    `);

    // Create ingestion run log table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS ingestion_runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        total_sources INTEGER NOT NULL,
        successful_sources TEXT NOT NULL,
        failed_sources TEXT NOT NULL,
        raw_items_parsed INTEGER NOT NULL,
        unique_articles_stored INTEGER NOT NULL,
        duplicates_merged INTEGER NOT NULL,
        total_in_database INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    return client;
  })();

  return initPromise;
}
