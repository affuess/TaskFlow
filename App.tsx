import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { initDatabase } from './src/database/db';
import { useTasks } from './src/hooks/useTasks';

function MainScreen() {
  const { tasks, loading, addTask, deleteTask } = useTasks();
  const [taskTitle, setTaskTitle] = useState('');

  const handleCreate = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Помилка', 'Введіть назву задачі');
      return;
    }
    addTask(taskTitle.trim());
    setTaskTitle('');
  };

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      'Видалення',
      `Видалити задачу "${title}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Видалити', style: 'destructive', onPress: () => deleteTask(id) },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TaskFlow</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Назва нової задачі..."
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleCreate}>
          <Text style={styles.addBtnText}>+ Додати</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>Задач немає. Створіть першу!</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskStatus}>
                  {item.completed ? '✅ Завершено' : '⏳ В процесі'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Text style={styles.deleteBtnText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDatabase()
      .then(() => setIsDbReady(true))
      .catch((err) => console.error('DB Init error:', err));
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Ініціалізація бази даних...</Text>
      </View>
    );
  }

  return <MainScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  taskInfo: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});