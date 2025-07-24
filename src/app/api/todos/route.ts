import { NextRequest, NextResponse } from 'next/server';
import { TodoFormData } from '@/types/todo';
// TODO: Đổi import từ jsonBinStorage sang firebaseStorage sau khi setup Firebase
import { getAllTodos, createTodo } from '@/services/firebaseStorage';
// import { getAllTodos, createTodo } from '@/services/jsonBinStorage';

// GET /api/todos - Get all todos
export async function GET() {
  try {
    const todos = await getAllTodos();
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

    const newTodo = await createTodo({
      title: formData.title.trim(),
      description: formData.description?.trim() || undefined,
      priority: formData.priority || 'medium',
      completed: false,
      createdAt: new Date(),
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
