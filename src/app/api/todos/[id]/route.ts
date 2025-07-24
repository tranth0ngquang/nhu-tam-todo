import { NextRequest, NextResponse } from 'next/server';
import { Todo } from '@/types/todo';
import { updateTodo, deleteTodo } from '@/services/firebaseStorage';

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates: Partial<Todo> = await request.json();

    const updatedTodo = await updateTodo(id, updates);
    return NextResponse.json(updatedTodo);
  } catch (error: unknown) {
    console.error('Error updating todo:', error);
    if (error instanceof Error && error.message === 'Todo not found') {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteTodo(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

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

// Safe JSON parse function
function parseJsonSafely(jsonString: string): TodoData[] {
  const parsed: unknown = JSON.parse(jsonString);
  return parsed as TodoData[];
}

// Read todos from file (fallback for local development)
async function readTodosFromFile(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const todos = parseJsonSafely(data);
    return todos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
    }));
  } catch (error: unknown) {
    console.error('Error reading todos:', error);
    return [];
  }
}

// Write todos to file (fallback for local development)
async function writeTodosToFile(todos: Todo[]): Promise<void> {
  const dataDir = path.dirname(DB_FILE);
  try {
    await fs.access(dataDir);
  } catch (error: unknown) {
    console.error('Creating directory:', error);
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(DB_FILE, JSON.stringify(todos, null, 2));
}

// Universal read function
async function readTodos(): Promise<Todo[]> {
  // Check if we're in Vercel environment (production)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log('Using memory storage for production');
    return await getMemoryTodos();
  }
  
  // Use file storage for local development
  console.log('Using file storage for development');
  return readTodosFromFile();
}

// Universal write function
async function writeTodos(todos: Todo[]): Promise<void> {
  // Check if we're in Vercel environment (production)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    console.log('Saving to memory storage for production');
    await saveMemoryTodos(todos);
    return;
  }
  
  // Use file storage for local development
  console.log('Saving to file storage for development');
  await writeTodosToFile(todos);
}

// GET /api/todos/[id] - Get specific todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todos = await readTodos();
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error: unknown) {
    console.error('Error reading todo:', error);
    return NextResponse.json({ error: 'Failed to read todo' }, { status: 500 });
  }
}

// PUT /api/todos/[id] - Update todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates: Partial<TodoFormData> & { completed?: boolean } = await request.json();
    const todos = await readTodos();
    
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const existingTodo = todos[todoIndex];
    
    // Update todo
    todos[todoIndex] = {
      ...existingTodo,
      ...(updates.title && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { 
        description: updates.description?.trim() || undefined 
      }),
      ...(updates.priority && { priority: updates.priority }),
      ...(updates.completed !== undefined && { 
        completed: updates.completed,
        completedAt: updates.completed ? new Date() : undefined,
      }),
    };

    await writeTodos(todos);
    return NextResponse.json(todos[todoIndex]);
  } catch (error: unknown) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE /api/todos/[id] - Delete todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const todos = await readTodos();
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    await writeTodos(todos);
    
    return NextResponse.json(deletedTodo);
  } catch (error: unknown) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
