import { Todo } from '@/types/todo';

// Define KV interface to avoid any types
interface KVStore {
  get: (key: string) => Promise<Todo[] | null>;
  set: (key: string, value: Todo[]) => Promise<void>;
}

// KV storage functions for Vercel deployment
let kv: KVStore | null = null;

async function getKV(): Promise<KVStore | null> {
  if (!kv) {
    try {
      const { kv: vercelKV } = await import('@vercel/kv');
      kv = vercelKV as KVStore;
    } catch (error: unknown) {
      console.warn('Vercel KV not available, using memory storage', error);
      return null;
    }
  }
  return kv;
}

// In-memory fallback for development
let memoryStorage: Todo[] = [];

export async function getAllTodos(): Promise<Todo[]> {
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      const todos = await kvStore.get('todos');
      return todos || [];
    } catch (error) {
      console.error('Error reading from KV:', error);
      return [];
    }
  }
  
  // Fallback to memory storage for development
  return memoryStorage;
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      await kvStore.set('todos', todos);
      return;
    } catch (error) {
      console.error('Error saving to KV:', error);
      throw error;
    }
  }
  
  // Fallback to memory storage for development
  memoryStorage = todos;
}

export async function isKVAvailable(): Promise<boolean> {
  const kvStore = await getKV();
  return !!kvStore;
}
