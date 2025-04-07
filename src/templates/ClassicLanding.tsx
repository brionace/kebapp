import { EditableContent } from "../components/EditableContent";
import { ClassicHeader } from "./header/ClassicHeader";
import { StyleEditor } from "../components/StyleEditor";
import { ClassicHero } from "./hero/ClassicHero";
import * as Popover from "@radix-ui/react-popover";
import { Settings } from "lucide-react";

export function ClassicLanding({
  config,
  onConfigChange,
}: {
  config: any;
  onConfigChange: (key: string, value: any) => void;
}) {
  return (
    <div className="min-h-screen">
      <ClassicHeader config={config} onConfigChange={onConfigChange} />

      <main>
        <ClassicHero config={config} onConfigChange={onConfigChange} />
        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {config.features.map((feature: any, index: number) => (
                <div key={index} className="group/feature relative">
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button aria-label="Settings" className="absolute -right-2 -top-2 p-1 rounded-full bg-white shadow-md opacity-0 group-hover/feature:opacity-100 transition-opacity z-10">
                        <Settings className="h-4 w-4 text-gray-500" />
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className="bg-white rounded-lg shadow-xl"
                        sideOffset={5}
                      >
                        <StyleEditor
                          style={feature.style}
                          onChange={(newStyle) => {
                            const newFeatures = [...config.features];
                            newFeatures[index] = {
                              ...feature,
                              style: newStyle,
                            };
                            onConfigChange("features", newFeatures);
                          }}
                        />
                        <Popover.Arrow className="fill-white" />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                  <div
                    className={`relative overflow-hidden ${feature.style.rounded} ${feature.style.shadow}`}
                    style={
                      feature.style.backgroundImage
                        ? {
                            backgroundImage: `url(${feature.style.backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    <div
                      className={`p-6 ${feature.style.bg} ${feature.style.backgroundOverlay}`}
                    >
                      <EditableContent
                        content={feature.title}
                        onChange={(value) => {
                          const newFeatures = [...config.features];
                          newFeatures[index] = { ...feature, title: value };
                          onConfigChange("features", newFeatures);
                        }}
                        className="text-lg font-semibold mb-2"
                      />
                      <EditableContent
                        content={feature.description}
                        onChange={(value) => {
                          const newFeatures = [...config.features];
                          newFeatures[index] = {
                            ...feature,
                            description: value,
                          };
                          onConfigChange("features", newFeatures);
                        }}
                        className="text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
