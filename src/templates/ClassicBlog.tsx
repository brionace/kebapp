import {EditableContent} from '../components/EditableContent'

export function ClassicBlog({ config, onConfigChange }: { config: any; onConfigChange: (key: string, value: any) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <EditableContent
            content={config.blogTitle}
            onChange={(value) => onConfigChange('blogTitle', value)}
            className="text-3xl font-bold text-gray-900"
          />
          <div className="mt-4 flex items-center">
            <div className="flex-1">
              <EditableContent
                content={config.authorName}
                onChange={(value) => onConfigChange('authorName', value)}
                className="text-lg font-medium text-gray-900"
              />
              <EditableContent
                content={config.bio}
                onChange={(value) => onConfigChange('bio', value)}
                className="text-gray-500"
              />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}