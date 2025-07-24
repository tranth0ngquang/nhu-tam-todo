import { Todo } from '@/types/todo';

interface JSONBinResponse {
  record: Todo[];
  metadata: {
    id: string;
    createdAt: string;
  };
}

class JSONBinStorage {
  private apiKey: string;
  private binId: string;
  private baseUrl = 'https://api.jsonbin.io/v3';
  private cache: Todo[] = [];
  private lastSync = 0;
  private syncInterval = 30000; // 30 seconds

  constructor() {
    this.apiKey = process.env.JSONBIN_API_KEY || '';
    this.binId = process.env.JSONBIN_BIN_ID || '';
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'X-Master-Key': this.apiKey,
      'X-Bin-Name': 'todos-storage'
    };
  }

  private shouldSync(): boolean {
    return Date.now() - this.lastSync > this.syncInterval;
  }

  async getTodos(): Promise<Todo[]> {
    // Return cache if recent
    if (!this.shouldSync() && this.cache.length > 0) {
      return this.cache;
    }

    try {
      if (!this.apiKey || !this.binId) {
        console.log('JSONBin not configured, using memory storage');
        return this.cache;
      }

      const response = await fetch(`${this.baseUrl}/b/${this.binId}/latest`, {
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`JSONBin API error: ${response.status}`);
      }

      const data: JSONBinResponse = await response.json();
      this.cache = data.record || [];
      this.lastSync = Date.now();
      
      console.log('📥 Synced from JSONBin:', this.cache.length, 'todos');
      return this.cache;
    } catch (error) {
      console.error('JSONBin fetch error:', error);
      // Return cache as fallback
      return this.cache;
    }
  }

  async saveTodos(todos: Todo[]): Promise<void> {
    this.cache = todos;
    
    try {
      if (!this.apiKey || !this.binId) {
        console.log('JSONBin not configured, storing in memory only');
        return;
      }

      const response = await fetch(`${this.baseUrl}/b/${this.binId}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(todos),
      });

      if (!response.ok) {
        throw new Error(`JSONBin save error: ${response.status}`);
      }

      this.lastSync = Date.now();
      console.log('📤 Saved to JSONBin:', todos.length, 'todos');
    } catch (error) {
      console.error('JSONBin save error:', error);
      // Continue with local cache
    }
  }

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
    };

    const todos = await this.getTodos();
    const updatedTodos = [...todos, newTodo];
    await this.saveTodos(updatedTodos);
    
    return newTodo;
  }

  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const todos = await this.getTodos();
    const index = todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Todo not found');
    }

    const updatedTodo = { ...todos[index], ...updates };
    todos[index] = updatedTodo;
    
    await this.saveTodos(todos);
    return updatedTodo;
  }

  async deleteTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const filteredTodos = todos.filter(t => t.id !== id);
    await this.saveTodos(filteredTodos);
  }
}

// Singleton instance
export const jsonBinStorage = new JSONBinStorage();

// Export functions for API routes
export async function getAllTodos(): Promise<Todo[]> {
  return jsonBinStorage.getTodos();
}

export async function createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
  return jsonBinStorage.createTodo(todo);
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  return jsonBinStorage.updateTodo(id, updates);
}

export async function deleteTodo(id: string): Promise<void> {
  return jsonBinStorage.deleteTodo(id);
}
