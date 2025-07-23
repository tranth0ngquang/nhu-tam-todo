import { Todo } from '@/types/todo';

// Define KV interface to avoid any types
interface KVStore {
  get: (key: string) => Promise<Todo[] | null>;
  set: (key: string, value: Todo[]) => Promise<void>;
}

// KV storage functions for Vercel deployment
let kv: KVStore | null = null;
let kvChecked = false;

async function getKV(): Promise<KVStore | null> {
  if (!kvChecked) {
    try {
      // Only try to import KV if we're in production environment
      if (process.env.VERCEL || process.env.KV_REST_API_URL) {
        const { kv: vercelKV } = await import('@vercel/kv');
        kv = vercelKV as KVStore;
      }
    } catch (error: unknown) {
      console.warn('Vercel KV not available, using file storage', error);
      kv = null;
    }
    kvChecked = true;
  }
  return kv;
}

export async function getAllTodos(): Promise<Todo[]> {
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      const todos = await kvStore.get('todos');
      return todos || [];
    } catch (error: unknown) {
      console.error('Error reading from KV:', error);
      throw error; // Let the calling function handle the fallback
    }
  }
  
  // Should not reach here - let calling function handle file storage
  throw new Error('KV not available');
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      await kvStore.set('todos', todos);
      return;
    } catch (error: unknown) {
      console.error('Error saving to KV:', error);
      throw error; // Let the calling function handle the fallback
    }
  }
  
  // Should not reach here - let calling function handle file storage
  throw new Error('KV not available');
}

export async function isKVAvailable(): Promise<boolean> {
  try {
    const kvStore = await getKV();
    return !!kvStore;
  } catch {
    return false;
  }
}
