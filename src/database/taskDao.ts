import { dbPromise } from "./db";

export interface LocalTask {
  id: number;
  title: string;
  completed: number; // 0 - in process, 1 - done
  synced: number;    // 0 - unsync, 1 - sync
}

export const taskDao = {
  getAll: async (): Promise<LocalTask[]> => {
    const db = await dbPromise;
    return await db.getAllAsync<LocalTask>('SELECT * FROM tasks ORDER BY id DESC;');
  },

  save: async (id: number, title: string, completed: number = 0, synced: number = 1): Promise<void> => {
    const db = await dbPromise;
    await db.runAsync(
      `INSERT INTO tasks (id, title, completed, synced) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET 
         title = excluded.title, 
         completed = excluded.completed, 
         synced = excluded.synced;`,
      [id, title, completed, synced]
    );
  },

  insertSave: async (tasks: Array<{ id: number; title: string; completed: boolean }>): Promise<void> => {
    const db = await dbPromise;
    await db.withTransactionAsync(async () => {
      for (const t of tasks) {
        await db.runAsync(
          `INSERT INTO tasks (id, title, completed, synced) VALUES (?, ?, ?, 1)
           ON CONFLICT(id) DO UPDATE SET 
             title = excluded.title, 
             completed = excluded.completed, 
             synced = 1;`,
          [t.id, t.title, t.completed ? 1 : 0]
        );
      }
    });
  },

  delete: async (id: number): Promise<void> => {
    const db = await dbPromise;
    await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
  },
};