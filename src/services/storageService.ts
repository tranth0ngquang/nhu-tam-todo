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
      // Try to import KV if we're in production or have environment variables
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
      const hasKVEnv = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
      
      console.log('KV Environment check:', {
        hasKVUrl: !!process.env.KV_REST_API_URL,
        hasKVToken: !!process.env.KV_REST_API_TOKEN,
        isVercel: !!process.env.VERCEL,
        isProduction,
        nodeEnv: process.env.NODE_ENV
      });
      
      // Only use KV in production if environment variables are available
      if (isProduction && hasKVEnv) {
        console.log('Attempting to import Vercel KV...');
        const { kv: vercelKV } = await import('@vercel/kv');
        kv = vercelKV as KVStore;
        console.log('KV import successful');
        
        // Test KV connection
        try {
          await vercelKV.ping();
          console.log('KV connection verified');
        } catch (pingError) {
          console.error('KV ping failed:', pingError);
          kv = null;
        }
      } else {
        console.log('Using fallback storage - not production or no KV env vars');
      }
    } catch (error: unknown) {
      console.error('KV import failed:', error);
      kv = null;
    }
    kvChecked = true;
  }
  return kv;
}

export async function getAllTodos(): Promise<Todo[]> {
  console.log('getAllTodos called');
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      console.log('Attempting to read from KV...');
      const todos = await kvStore.get('todos');
      console.log('KV read result:', todos);
      return todos || [];
    } catch (error: unknown) {
      console.error('Error reading from KV:', error);
      throw error; // Let the calling function handle the fallback
    }
  }
  
  console.log('KV not available, throwing error for fallback');
  throw new Error('KV not available');
}

export async function saveTodos(todos: Todo[]): Promise<void> {
  console.log('saveTodos called with:', todos.length, 'items');
  const kvStore = await getKV();
  
  if (kvStore) {
    try {
      console.log('Attempting to save to KV...');
      await kvStore.set('todos', todos);
      console.log('KV save successful');
      return;
    } catch (error: unknown) {
      console.error('Error saving to KV:', error);
      throw error; // Let the calling function handle the fallback
    }
  }
  
  console.log('KV not available, throwing error for fallback');
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
