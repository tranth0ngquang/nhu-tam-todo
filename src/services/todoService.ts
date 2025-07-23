import { Todo, TodoFormData, TodoPriority } from '@/types/todo';

const API_BASE = '/api/todos';

interface TodoResponse {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

// Get all todos
export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  const todos = await response.json() as TodoResponse[];
  return todos.map((todo) => ({
    ...todo,
    createdAt: new Date(todo.createdAt),
    completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
  }));
}

// Create new todo
export async function createTodo(data: TodoFormData): Promise<Todo> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  const todo = await response.json() as TodoResponse;
  return {
    ...todo,
    createdAt: new Date(todo.createdAt),
    completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
  };
}

// Update todo
export async function updateTodo(id: string, data: TodoFormData): Promise<Todo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  const todo = await response.json() as TodoResponse;
  return {
    ...todo,
    createdAt: new Date(todo.createdAt),
    completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
  };
}

// Toggle todo completion
export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle todo');
  }

  const todo = await response.json() as TodoResponse;
  return {
    ...todo,
    createdAt: new Date(todo.createdAt),
    completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
  };
}

// Delete todo
export async function deleteTodo(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
}
