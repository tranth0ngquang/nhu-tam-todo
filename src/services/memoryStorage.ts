import { Todo } from '@/types/todo';

// Enhanced in-memory storage for Vercel with timestamp tracking
let memoryStorage: Todo[] = [];
let initialized = false;
let lastActivity = Date.now();

// Track when storage was last used to detect cold starts
function trackActivity() {
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;
  
  // If more than 30 minutes, likely a cold start
  if (timeSinceLastActivity > 30 * 60 * 1000) {
    console.warn('🔥 Cold start detected! Data may have been lost.');
    console.warn(`⏰ Time since last activity: ${Math.round(timeSinceLastActivity / 1000 / 60)} minutes`);
  }
  
  lastActivity = now;
}

// Initialize with sample data and warning
function initializeStorage() {
  if (!initialized) {
    trackActivity();
    
    memoryStorage = [
      {
        id: 'sample-1',
        title: '⚠️ Memory Storage Warning',
        description: 'Dữ liệu sẽ bị mất khi Vercel function restart (sau 10-15 phút không hoạt động). Để lưu trữ lâu dài, cần setup Vercel KV.',
        priority: 'urgent' as const,
        completed: false,
        createdAt: new Date(),
      },
      {
        id: 'sample-2', 
        title: '📝 Ví dụ công việc',
        description: 'Đây là dữ liệu mẫu. Bạn có thể thêm/sửa/xóa các công việc.',
        priority: 'medium' as const,
        completed: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      }
    ];
    
    initialized = true;
    console.log('🚀 Memory storage initialized with sample data');
    console.log('⚠️ WARNING: Data will be lost on Vercel function cold start');
  }
}

export async function getAllTodos(): Promise<Todo[]> {
  trackActivity();
  console.log('📖 Reading from memory storage (non-persistent)');
  initializeStorage();
  return [...memoryStorage]; // Return a copy
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  trackActivity();
  console.log(`💾 Saving ${todos.length} todos to memory storage (non-persistent)`);
  memoryStorage = [...todos]; // Store a copy
  
  // Log warning about data persistence
  if (todos.length > 2) { // More than sample data
    console.warn('⚠️ Important: Your data is stored in memory and will be lost on server restart');
    console.warn('🔧 To prevent data loss, setup Vercel KV in your deployment');
  }
}

export async function isKVAvailable(): Promise<boolean> {
  // Always return false for memory storage
  return false;
}
