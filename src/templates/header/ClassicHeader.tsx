import {EditableContent} from '../../components/EditableContent'
import {ClassicNav} from '../nav/ClassicNav'

export function ClassicHeader({ config, onConfigChange }: { config: any; onConfigChange: (key: string, value: any) => void }) {
  return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 justify-between items-center">
            <EditableContent
              content={config.title}
              onChange={(value) => onConfigChange('title', value)}
              className="text-xl font-semibold text-gray-900"
            />
            <ClassicNav config={config} onConfigChange={onConfigChange}  />
          </div>
        </div>
      </header>
  )
}