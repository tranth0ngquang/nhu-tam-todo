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
