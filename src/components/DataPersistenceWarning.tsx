'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function DataPersistenceWarning() {
  const [isProduction, setIsProduction] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if we're in production and using memory storage
    setIsProduction(
      typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost'
    );
  }, []);

  if (!isProduction || !isVisible) {
    return null;
  }

  return (
    <Alert className="mx-4 mb-4 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-orange-800">
          <strong>⚠️ Lưu ý:</strong> Data sẽ bị reset sau 10-15 phút không hoạt động. 
          <br />
          Setup JSONBin API để data persistent lâu dài (Free).
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
            onClick={() => window.open('https://github.com/tranth0ngquang/nhu-tam-todo/blob/main/SIMPLE_BACKEND_OPTIONS.md', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Setup Guide
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-700 hover:bg-orange-100"
            onClick={() => setIsVisible(false)}
          >
            ✕
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
