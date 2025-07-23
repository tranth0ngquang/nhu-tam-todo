'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Todo, TodoFormData, PRIORITY_LABELS, PRIORITY_COLORS, TodoPriority } from '@/types/todo';
import { Pencil, Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, data: TodoFormData) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<TodoFormData>({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
  });

  const getPriorityIcon = (priority: TodoPriority) => {
    switch (priority) {
      case 'low': return '🟢';
      case 'medium': return '🔵';
      case 'high': return '🟠';
      case 'urgent': return '🔴';
    }
  };

  const handleUpdate = () => {
    if (editData.title.trim()) {
      onUpdate(todo.id, {
        title: editData.title.trim(),
        description: editData.description?.trim() || undefined,
        priority: editData.priority,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
    });
    setIsEditing(false);
  };

  return (
    <Card className={`w-full ${todo.completed ? 'opacity-70' : ''}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
            className="mt-0.5 sm:mt-1 shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h3 className={`font-medium text-sm sm:text-base break-words flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.title}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border shrink-0 ${PRIORITY_COLORS[todo.priority]}`}>
                {getPriorityIcon(todo.priority)} {PRIORITY_LABELS[todo.priority]}
              </span>
            </div>
            {todo.description && (
              <p className={`text-xs sm:text-sm text-muted-foreground mb-2 break-words ${todo.completed ? 'line-through' : ''}`}>
                {todo.description}
              </p>
            )}
            <div className="text-xs text-muted-foreground">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span>Tạo: {todo.createdAt.toLocaleString('vi-VN')}</span>
                {todo.completedAt && (
                  <span className="sm:ml-2">
                    • Hoàn thành: {todo.completedAt.toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 shrink-0">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={todo.completed} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sr-only">Chỉnh sửa</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-2 max-w-[calc(100vw-1rem)] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-lg">Chỉnh sửa việc cần làm</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title" className="text-sm">Tiêu đề *</Label>
                    <Input
                      id="edit-title"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Nhập tiêu đề..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-description" className="text-sm">Mô tả</Label>
                    <Textarea
                      id="edit-description"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Nhập mô tả..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-priority" className="text-sm">Mức độ ưu tiên</Label>
                    <Select value={editData.priority} onValueChange={(value: TodoPriority) => setEditData({ ...editData, priority: value })}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Chọn mức độ ưu tiên" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 {PRIORITY_LABELS.low}</SelectItem>
                        <SelectItem value="medium">🔵 {PRIORITY_LABELS.medium}</SelectItem>
                        <SelectItem value="high">🟠 {PRIORITY_LABELS.high}</SelectItem>
                        <SelectItem value="urgent">🔴 {PRIORITY_LABELS.urgent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      Hủy
                    </Button>
                    <Button onClick={handleUpdate} disabled={!editData.title.trim()} size="sm">
                      Cập nhật
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(todo.id)}
              className="text-destructive hover:text-destructive h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
