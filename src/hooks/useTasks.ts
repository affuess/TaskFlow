import { useState, useEffect } from 'react';
import { taskDao, LocalTask } from '../database/taskDao';
import { apiClient } from '../api/client';

export function useTasks() {
  const [tasks, setTasks] = useState<LocalTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTasks = async () => {
    try {
      const localData = await taskDao.getAll();
      setTasks(localData);
    } catch (err) {
      console.log('Error loading tasks from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    const newId = Date.now();
    try {
      await taskDao.save(newId, title, 0, 0);
      await loadTasks();

      await apiClient.post('/todos', {
        id: newId,
        title,
        completed: false,
      });

      await taskDao.save(newId, title, 0, 1);
      await loadTasks();
    } catch (err) {
      console.log('Network error when adding task, saved locally:', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskDao.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));

      await apiClient.delete(`/todos/${id}`);
    } catch (err) {
      console.log('Network error when deleting task:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return { tasks, loading, addTask, deleteTask, refreshTasks: loadTasks };
}