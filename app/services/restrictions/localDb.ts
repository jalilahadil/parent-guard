import * as SQLite from 'expo-sqlite';
import type { AppRestriction, UsageRecord } from '../../types';
import { LOCAL_DB_NAME } from '../../utils/constants';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(LOCAL_DB_NAME);
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS restrictions (
          id TEXT PRIMARY KEY NOT NULL,
          package_name TEXT NOT NULL UNIQUE,
          app_label TEXT NOT NULL,
          blocked INTEGER NOT NULL DEFAULT 0,
          daily_limit_minutes INTEGER,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS usage_records (
          id TEXT PRIMARY KEY NOT NULL,
          package_name TEXT NOT NULL,
          app_label TEXT NOT NULL,
          start_time INTEGER NOT NULL,
          end_time INTEGER NOT NULL,
          duration_ms INTEGER NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_usage_package ON usage_records(package_name);
      `);
      return db;
    })();
  }
  return dbPromise;
}

export async function cacheRestrictions(items: AppRestriction[]): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM restrictions');
    for (const item of items) {
      await db.runAsync(
        `INSERT INTO restrictions (id, package_name, app_label, blocked, daily_limit_minutes, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        item.id,
        item.packageName,
        item.appLabel,
        item.blocked ? 1 : 0,
        item.dailyLimitMinutes,
        item.updatedAt,
      );
    }
  });
}

export async function getCachedRestrictions(): Promise<AppRestriction[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    package_name: string;
    app_label: string;
    blocked: number;
    daily_limit_minutes: number | null;
    updated_at: number;
  }>('SELECT * FROM restrictions ORDER BY app_label ASC');

  return rows.map((row) => ({
    id: row.id,
    packageName: row.package_name,
    appLabel: row.app_label,
    blocked: row.blocked === 1,
    dailyLimitMinutes: row.daily_limit_minutes,
    updatedAt: row.updated_at,
  }));
}

export async function isPackageBlocked(packageName: string): Promise<boolean> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ blocked: number }>(
    'SELECT blocked FROM restrictions WHERE package_name = ? LIMIT 1',
    packageName,
  );
  return row?.blocked === 1;
}

export async function insertUsageRecord(record: UsageRecord): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO usage_records
      (id, package_name, app_label, start_time, end_time, duration_ms)
     VALUES (?, ?, ?, ?, ?, ?)`,
    record.id,
    record.packageName,
    record.appLabel,
    record.startTime,
    record.endTime,
    record.durationMs,
  );
}

export async function listUsageRecords(limit = 100): Promise<UsageRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    package_name: string;
    app_label: string;
    start_time: number;
    end_time: number;
    duration_ms: number;
  }>('SELECT * FROM usage_records ORDER BY start_time DESC LIMIT ?', limit);

  return rows.map((row) => ({
    id: row.id,
    packageName: row.package_name,
    appLabel: row.app_label,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMs: row.duration_ms,
  }));
}
