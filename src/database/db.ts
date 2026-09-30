import * as SQLite from 'expo-sqlite';

export const dbPromise = SQLite.openDatabaseAsync('taskFlow.db');

export const initDatabase = async (): Promise<void> => {
  const db = await dbPromise;
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      synced INTEGER DEFAULT 1
    );
  `);

  console.log('Database initialized');
};