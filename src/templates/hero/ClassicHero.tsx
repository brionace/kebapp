import {EditableContent} from '../../components/EditableContent'

export function ClassicHero({ config, onConfigChange }: { config: any; onConfigChange: (key: string, value: any) => void }){
  return (
    <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <EditableContent
                content={config.heroTitle}
                onChange={(value) => onConfigChange('heroTitle', value)}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
              />
              <EditableContent
                content={config.heroSubtitle}
                onChange={(value) => onConfigChange('heroSubtitle', value)}
                className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto"
              />
              <div className="mt-8">
                <EditableContent
                  content={config.ctaText}
                  onChange={(value) => onConfigChange('ctaText', value)}
                  className="inline-block px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                />
              </div>
            </div>
          </div>
        </div>

  )
}