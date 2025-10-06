import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export const ImageUpload = ({ value, onChange, onRemove, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFile(imageFile);
    }
  };

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'relative flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed transition-colors cursor-pointer',
            isDragging && !disabled ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={disabled}
          />
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-1">
            Перетащите изображение сюда
          </p>
          <p className="text-xs text-muted-foreground">
            или нажмите для выбора файла
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, GIF до 5MB
          </p>
        </div>
      )}
    </div>
  );
};
