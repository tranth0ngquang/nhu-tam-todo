'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TodoFormData, PRIORITY_LABELS, TodoPriority } from '@/types/todo';
import { Plus } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (data: TodoFormData) => void;
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.title.trim()) {
      onAdd({
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        priority: formData.priority,
      });
      
      setFormData({ title: '', description: '', priority: 'medium' });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', priority: 'medium' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
          <Plus className="h-4 w-4 mr-2 shrink-0" />
          <span>Thêm việc mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-2 max-w-[calc(100vw-1rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Thêm việc cần làm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm">Tiêu đề *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề..."
              required
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-sm">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả..."
              rows={3}
              className="text-sm"
            />
          </div>
          <div>
            <Label htmlFor="priority" className="text-sm">Mức độ ưu tiên</Label>
            <Select value={formData.priority} onValueChange={(value: TodoPriority) => setFormData({ ...formData, priority: value })}>
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
            <Button type="button" variant="outline" onClick={handleCancel} size="sm">
              Hủy
            </Button>
            <Button type="submit" disabled={!formData.title.trim()} size="sm">
              Thêm việc
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
