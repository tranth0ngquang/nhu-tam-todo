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

// Read todos from file
async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    const todos = JSON.parse(data) as TodoData[];
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

// Write todos to file
async function writeTodos(todos: Todo[]): Promise<void> {
  const dataDir = path.dirname(DB_FILE);
  try {
    await fs.access(dataDir);
  } catch (error: unknown) {
    console.error('Creating directory:', error);
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(DB_FILE, JSON.stringify(todos, null, 2));
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
