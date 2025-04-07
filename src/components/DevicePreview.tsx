import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface DevicePreviewProps {
  children: React.ReactNode;
}

export function DevicePreview({ children }: DevicePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getPreviewWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-4">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-md transition-colors ${
              device === 'desktop' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Desktop view"
          >
            <Monitor className="h-5 w-5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-md transition-colors ${
              device === 'tablet' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Tablet view"
          >
            <Tablet className="h-5 w-5" />
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-md transition-colors ${
              device === 'mobile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-500'
            }`}
            title="Mobile view"
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <div className={`w-full ${getPreviewWidth()} transition-all duration-300`}>
          {children}
        </div>
      </div>
    </div>
  );
}