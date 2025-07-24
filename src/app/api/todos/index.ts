import { NextRequest, NextResponse } from 'next/server';
import { firebaseStorage } from '@/services/firebaseStorage';

export async function GET() {
  try {
    const todos = await firebaseStorage.getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, priority = 'medium' } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    const newTodo = await firebaseStorage.createTodo({
      title,
      priority,
      completed: false,
      createdAt: new Date(),
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
