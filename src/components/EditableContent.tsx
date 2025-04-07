import { useState } from 'react';
import { Pencil } from 'lucide-react';

interface EditableContentProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function EditableContent({ content, onChange, className = '' }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(content);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(value);
  };

  if (isEditing) {
    return (
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className={`w-full p-2 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
      />
    );
  }

  if(!content) return

  return (
    <div 
      className={`group relative cursor-pointer ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Pencil className="h-4 w-4 text-gray-400" />
      </div>
      {content}
    </div>
  );
}