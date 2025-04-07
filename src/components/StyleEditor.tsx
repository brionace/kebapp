import React, { useState } from 'react';

interface StyleEditorProps {
  style: {
    bg: string;
    rounded: string;
    shadow: string;
    backgroundImage: string;
    backgroundOverlay: string;
  };
  onChange: (style: any) => void;
}

const BACKGROUND_OPTIONS = [
  { label: 'White', value: 'bg-white' },
  { label: 'Light Gray', value: 'bg-gray-50' },
  { label: 'Light Blue', value: 'bg-blue-50' },
  { label: 'Light Green', value: 'bg-green-50' },
];

const ROUNDED_OPTIONS = [
  { label: 'None', value: 'rounded-none' },
  { label: 'Small', value: 'rounded' },
  { label: 'Medium', value: 'rounded-lg' },
  { label: 'Large', value: 'rounded-xl' },
];

const SHADOW_OPTIONS = [
  { label: 'None', value: 'shadow-none' },
  { label: 'Small', value: 'shadow-sm' },
  { label: 'Medium', value: 'shadow-md' },
  { label: 'Large', value: 'shadow-lg' },
];

const OVERLAY_OPTIONS = [
  { label: 'None', value: 'bg-opacity-100' },
  { label: 'Light', value: 'bg-opacity-75' },
  { label: 'Medium', value: 'bg-opacity-50' },
  { label: 'Heavy', value: 'bg-opacity-25' },
];

export function StyleEditor({ style, onChange }: StyleEditorProps) {
  const [imageUrl, setImageUrl] = useState(style.backgroundImage);

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...style, backgroundImage: imageUrl });
  };

  const clearBackgroundImage = () => {
    setImageUrl('');
    onChange({ ...style, backgroundImage: '' });
  };

  return (
    <div className="p-4 w-80 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
        <form onSubmit={handleImageSubmit} className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          />
          {style.backgroundImage && (
            <button
              type="button"
              onClick={clearBackgroundImage}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {style.backgroundImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Overlay</label>
          <select
            value={style.backgroundOverlay}
            onChange={(e) => onChange({ ...style, backgroundOverlay: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {OVERLAY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <select
          value={style.bg}
          onChange={(e) => onChange({ ...style, bg: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {BACKGROUND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rounded Corners</label>
        <select
          value={style.rounded}
          onChange={(e) => onChange({ ...style, rounded: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {ROUNDED_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shadow</label>
        <select
          value={style.shadow}
          onChange={(e) => onChange({ ...style, shadow: e.target.value })}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {SHADOW_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}