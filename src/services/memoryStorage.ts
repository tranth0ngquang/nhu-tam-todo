import { Todo } from '@/types/todo';

// Simple in-memory storage for Vercel (since filesystem is read-only)
let memoryStorage: Todo[] = [];
let initialized = false;

// Initialize with some sample data on first run
function initializeStorage() {
  if (!initialized) {
    memoryStorage = [
      {
        id: '1',
        title: 'Ví dụ công việc',
        description: 'Đây là một công việc mẫu. Bạn có thể thêm/sửa/xóa các công việc khác.',
        priority: 'medium' as const,
        completed: false,
        createdAt: new Date('2025-01-01T00:00:00Z'),
      }
    ];
    initialized = true;
    console.log('Memory storage initialized with sample data');
  }
}

export async function getAllTodos(): Promise<Todo[]> {
  console.log('getAllTodos called - using memory storage');
  initializeStorage();
  return [...memoryStorage]; // Return a copy
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  console.log('saveTodos called with:', todos.length, 'items - using memory storage');
  memoryStorage = [...todos]; // Store a copy
}

export async function isKVAvailable(): Promise<boolean> {
  // For now, always return false to use memory storage
  return false;
}
