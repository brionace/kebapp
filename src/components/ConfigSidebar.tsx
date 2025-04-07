/* eslint-disable @typescript-eslint/ban-ts-comment */
/* @ts-ignore */
import { X, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import type { Template } from "../types";

interface ConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template;
  config: Record<string, any>;
  onConfigChange: (key: string, value: any) => void;
  onAddArrayItem: (key: string, schema: any) => void;
  onRemoveArrayItem: (key: string, index: number, path: string[]) => void;
  onAddLink: (path: string[], defaultLink: any) => void;
  onRemoveLink: (path: string[], index: number) => void;
  onToggleShow: (key: string, value: boolean) => void;
}

export function ConfigSidebar({
  isOpen,
  onClose,
  template,
  config,
  onConfigChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onAddLink,
  onRemoveLink,
  onToggleShow,
}: ConfigSidebarProps) {
  const renderField = (key: string, schema: any, path: string[] = []) => {
    const currentPath = [...path, key];
    const currentValue =
      path.reduce((obj, key) => obj?.[key], config)?.[key] ?? schema.default;

    switch (schema.type) {
      case "string":
        if (schema.options) {
          return (
            <div key={key} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {schema.label}
              </label>
              <select
                value={currentValue}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (path.length === 0) {
                    onConfigChange(key, newValue);
                  } else {
                    const newConfig = { ...config };
                    let target = newConfig;
                    path.forEach((p, i) => {
                      if (i === path.length - 1) {
                        target[p] = { ...target[p], [key]: newValue };
                      } else {
                        target = target[p];
                      }
                    });
                    onConfigChange(path[0], newConfig[path[0]]);
                  }
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {schema.options.map((option: string) => (
                  <option key={option} value={option}>
                    {option.split("-").join(" ")}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {schema.label}
            </label>
            <input
              type="text"
              value={currentValue || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                if (path.length === 0) {
                  onConfigChange(key, newValue);
                } else {
                  const newConfig = { ...config };
                  let target = newConfig;
                  path.forEach((p, i) => {
                    if (i === path.length - 1) {
                      target[p] = { ...target[p], [key]: newValue };
                    } else {
                      target = target[p];
                    }
                  });
                  onConfigChange(path[0], newConfig[path[0]]);
                }
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        );

      case "array":
        return (
          <div key={key} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-900">
                {schema.label}
              </h4>
              <button
                onClick={() => onAddArrayItem(currentPath, schema)}
                className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add {schema.label.slice(0, -1)}
              </button>
            </div>
            <div className="space-y-4">
              {currentValue?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="text-sm font-medium text-gray-700">
                      {schema.label.slice(0, -1)} {index + 1}
                    </h5>
                    <button
                      onClick={() => onRemoveArrayItem(key, index, currentPath)}
                      className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      // disabled={currentValue.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {Object.entries(item).map(([itemKey, itemValue]) => {
                    if (typeof itemValue === "object" && itemValue !== null) {
                      return renderField(
                        itemKey,
                        { type: "object", properties: itemValue },
                        [...currentPath, index]
                      );
                    }
                    return renderField(
                      itemKey,
                      { type: "string", label: itemKey },
                      [...currentPath, index]
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );

      case "object": {
        if (!schema.properties) return null;
        const hasShow = Boolean(template.configSchema[key]?.show);
        const show = currentValue.show;
        return (
          <div key={key} className="mb-8">
            <div className="flex gap-2 mb-4">
              <h4>{schema.label}</h4>
              {hasShow !== undefined && (
                <label className="hover:cursor-pointer">
                  {show ? <Eye /> : <EyeOff />}
                  <input
                    type="checkbox"
                    checked={show}
                    onClick={(e) => onToggleShow(key, e.currentTarget.checked)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="space-y-4">
              {Object.entries(schema.properties).map(([propKey, propSchema]) =>
                renderField(propKey, propSchema, [...currentPath])
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const updateConfig = (key: string, value: any, path: string[]) => {
    if (path.length === 0) {
      onConfigChange(key, value);
    } else {
      const newConfig = { ...config };
      let target = newConfig;
      path.forEach((p, i) => {
        if (i === path.length - 1) {
          target[p] = { ...target[p], [key]: value };
        } else {
          target = target[p];
        }
      });
      onConfigChange(path[0], newConfig[path[0]]);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-10 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Template Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(template.configSchema).map(([key, schema]) =>
            renderField(key, schema)
          )}
        </div>
      </div>
    </div>
  );
}
