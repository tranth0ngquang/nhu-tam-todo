import { TodoList } from '@/components/TodoList';

export default function Home() {
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      <TodoList />
    </div>
  );
}
