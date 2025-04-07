import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { EditableContent } from '../components/EditableContent';

interface BlankTemplateProps {
  config: {
    title: string;
    description: string;
    components: any[];
  };
  onConfigChange: (key: string, value: any) => void;
}

export function BlankTemplate({ config, onConfigChange }: BlankTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <EditableContent
            content={config.title}
            onChange={(value) => onConfigChange('title', value)}
            className="text-xl font-semibold text-gray-900"
          />
          <EditableContent
            content={config.description}
            onChange={(value) => onConfigChange('description', value)}
            className="mt-1 text-sm text-gray-500"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {config.components.length === 0 ? (
          <div className="text-center py-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <LayoutGrid className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No components added yet</h3>
            <p className="mt-1 text-sm text-gray-500">Start building your page by adding components</p>
          </div>
        ) : (
          <div className="space-y-8">
            {config.components.map((component, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                Component {index + 1}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}