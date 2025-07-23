'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoItem } from '@/components/TodoItem';
import { useTodos } from '@/hooks/useTodos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

export function TodoList() {
  const {
    incompleteTodos,
    completedTodos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
        <Card>
          <CardContent className="text-center p-6 sm:p-8">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 font-medium">Lỗi kết nối</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Thử lại
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 flex-wrap">
            <ListTodo className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-center">Danh sách việc cần làm</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Quản lý công việc hàng ngày của bạn một cách hiệu quả
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <AddTodoForm onAdd={addTodo} />
        </CardContent>
      </Card>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="todo" className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
            <Circle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Chưa làm</span>
            <span className="xs:hidden">Todo</span>
            <span className="ml-1">({incompleteTodos.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Đã làm</span>
            <span className="xs:hidden">Done</span>
            <span className="ml-1">({completedTodos.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          {incompleteTodos.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6 sm:p-8">
                <Circle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  Chưa có việc nào cần làm. Hãy thêm việc mới!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {incompleteTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          {completedTodos.length === 0 ? (
            <Card>
              <CardContent className="text-center p-6 sm:p-8">
                <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm sm:text-base">
                  Chưa hoàn thành việc nào. Hãy bắt đầu làm việc!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
