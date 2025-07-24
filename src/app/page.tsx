import { TodoList } from '@/components/TodoList';
import { DataPersistenceWarning } from '@/components/DataPersistenceWarning';

export default function Home() {
  return (
    <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
      <DataPersistenceWarning />
      <TodoList />
    </div>
  );
}
