'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function DataPersistenceWarning() {
  const [isProduction, setIsProduction] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Firebase is configured, no warning needed
    setIsProduction(false);
  }, []);

  if (!isProduction || !isVisible) {
    return null;
  }

  return (
    <Alert className="mx-4 mb-4 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-orange-800">
          <strong>⚠️ Lưu ý:</strong> Đang dùng JSONBin storage tạm thời. 
          <br />
          Setup Firebase để có real-time sync và persistent storage.
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
            onClick={() => window.open('https://github.com/tranth0ngquang/nhu-tam-todo/blob/main/FIREBASE_SETUP_GUIDE.md', '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Setup Guide (Firebase)
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
