import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Todo, TodoFormData, TodoPriority } from '@/types/todo';

const DB_FILE = path.join(process.cwd(), 'data', 'todos.json');

interface TodoData {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DB_FILE);
  try {
    await fs.access(dataDir);
  } catch (error: unknown) {
    console.error('Creating directory:', error);
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Safe JSON parse function
function parseJsonSafely(jsonString: string): TodoData[] {
  const parsed: unknown = JSON.parse(jsonString);
  return parsed as TodoData[];
}

// Read todos from file
async function readTodos(): Promise<Todo[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE, 'utf8');
    const todos = parseJsonSafely(data);
    return todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
    }));
  } catch (error: unknown) {
    // If file doesn't exist, return empty array
    console.error('Error reading todos:', error);
    return [];
  }
}

// Write todos to file
async function writeTodos(todos: Todo[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(todos, null, 2));
}

// GET /api/todos - Get all todos
export async function GET() {
  try {
    const todos = await readTodos();
    return NextResponse.json(todos);
  } catch (error: unknown) {
    console.error('Error reading todos:', error);
    return NextResponse.json({ error: 'Failed to read todos' }, { status: 500 });
  }
}

// POST /api/todos - Create new todo
export async function POST(request: NextRequest) {
  try {
    const formData: TodoFormData = await request.json();
    
    if (!formData.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const todos = await readTodos();
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      priority: formData.priority || 'medium',
      completed: false,
      createdAt: new Date(),
    };

    todos.unshift(newTodo);
    await writeTodos(todos);

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
