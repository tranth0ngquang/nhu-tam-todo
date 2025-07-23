'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFormData, PRIORITY_ORDER } from '@/types/todo';
import * as todoService from '@/services/todoService';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from API on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError(null);
        const fetchedTodos = await todoService.fetchTodos();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error loading todos:', error);
        setError('Không thể tải danh sách việc cần làm');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  // Add new todo
  const addTodo = async (data: TodoFormData) => {
    try {
      setError(null);
      const newTodo = await todoService.createTodo(data);
      setTodos(prev => [newTodo, ...prev]);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Không thể thêm việc cần làm');
    }
  };

  // Update todo
  const updateTodo = async (id: string, data: TodoFormData) => {
    try {
      setError(null);
      const updatedTodo = await todoService.updateTodo(id, data);
      setTodos(prev =>
        prev.map(todo => (todo.id === id ? updatedTodo : todo))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Không thể cập nhật việc cần làm');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    try {
      setError(null);
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = await todoService.toggleTodo(id, !todo.completed);
      setTodos(prev =>
        prev.map(t => (t.id === id ? updatedTodo : t))
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      setError('Không thể cập nhật trạng thái việc cần làm');
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Không thể xóa việc cần làm');
    }
  };

  // Get incomplete todos sorted by priority (urgent first)
  const incompleteTodos = todos
    .filter(todo => !todo.completed)
    .sort((a, b) => {
      // Sort by priority first (urgent -> high -> medium -> low)
      const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // Then by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

  // Get completed todos sorted by completion date (recently completed first, then older last)
  const completedTodos = todos
    .filter(todo => todo.completed)
    .sort((a, b) => {
      if (a.completedAt && b.completedAt) {
        return a.completedAt.getTime() - b.completedAt.getTime(); // Earlier completion first
      }
      return 0;
    });

  return {
    todos,
    incompleteTodos,
    completedTodos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  };
}
