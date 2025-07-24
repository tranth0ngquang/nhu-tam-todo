import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query,
  Timestamp,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  FieldValue
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Todo, TodoPriority } from '@/types/todo';

const COLLECTION_NAME = 'todos';

// Convert Firestore data to Todo type
function convertFirestoreToTodo(doc: QueryDocumentSnapshot<DocumentData>): Todo {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    description: data.description as string | undefined,
    priority: data.priority as TodoPriority,
    completed: data.completed as boolean,
    createdAt: data.createdAt?.toDate() || new Date(),
    completedAt: data.completedAt?.toDate(),
  };
}

// Convert Todo to Firestore data
function convertTodoToFirestore(todo: Omit<Todo, 'id'>) {
  return {
    title: todo.title,
    description: todo.description || null,
    priority: todo.priority,
    completed: todo.completed,
    createdAt: todo.createdAt ? Timestamp.fromDate(todo.createdAt) : serverTimestamp(),
    completedAt: todo.completedAt ? Timestamp.fromDate(todo.completedAt) : null,
  };
}

export class FirebaseStorage {
  // Get all todos
  async getTodos(): Promise<Todo[]> {
    try {
      const todosRef = collection(db, COLLECTION_NAME);
      const q = query(todosRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const todos = querySnapshot.docs.map(convertFirestoreToTodo);
      console.log('📥 Loaded from Firebase:', todos.length, 'todos');
      return todos;
    } catch (error) {
      console.error('Firebase getTodos error:', error);
      throw new Error('Failed to get todos from Firebase');
    }
  }

  // Create new todo
  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    try {
      const todosRef = collection(db, COLLECTION_NAME);
      const firestoreData = convertTodoToFirestore(todo);
      
      const docRef = await addDoc(todosRef, firestoreData);
      
      const newTodo: Todo = {
        ...todo,
        id: docRef.id,
      };
      
      console.log('📤 Created in Firebase:', newTodo.title);
      return newTodo;
    } catch (error) {
      console.error('Firebase createTodo error:', error);
      throw new Error('Failed to create todo in Firebase');
    }
  }

  // Update existing todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      const todoRef = doc(db, COLLECTION_NAME, id);
      
      // Convert updates to Firestore format
      const firestoreUpdates: Record<string, FieldValue | Partial<unknown> | undefined> = { ...updates };
      if (updates.createdAt) {
        firestoreUpdates.createdAt = Timestamp.fromDate(updates.createdAt);
      }
      if (updates.completedAt) {
        firestoreUpdates.completedAt = Timestamp.fromDate(updates.completedAt);
      }
      
      await updateDoc(todoRef, firestoreUpdates);
      
      // Get updated document to return
      const todos = await this.getTodos();
      const updatedTodo = todos.find(t => t.id === id);
      
      if (!updatedTodo) {
        throw new Error('Todo not found after update');
      }
      
      console.log('📝 Updated in Firebase:', updatedTodo.title);
      return updatedTodo;
    } catch (error) {
      console.error('Firebase updateTodo error:', error);
      throw new Error('Failed to update todo in Firebase');
    }
  }

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    try {
      const todoRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(todoRef);
      
      console.log('🗑️ Deleted from Firebase:', id);
    } catch (error) {
      console.error('Firebase deleteTodo error:', error);
      throw new Error('Failed to delete todo from Firebase');
    }
  }
}

// Singleton instance
export const firebaseStorage = new FirebaseStorage();

// Export functions for API routes
export async function getAllTodos(): Promise<Todo[]> {
  return firebaseStorage.getTodos();
}

export async function createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
  return firebaseStorage.createTodo(todo);
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
  return firebaseStorage.updateTodo(id, updates);
}

export async function deleteTodo(id: string): Promise<void> {
  return firebaseStorage.deleteTodo(id);
}
