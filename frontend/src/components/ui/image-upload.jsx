import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { uploadsApi } from '@/services/api';

export const ImageUpload = ({ value, onChange, onRemove, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled && !uploading) {
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

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFile(imageFile);
    }
  };

  const handleFile = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadsApi.uploadImage(file);
      onChange(result.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="mb-3">
      {value ? (
        <div className="position-relative">
          <div className="ratio ratio-16x9 rounded border overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-100 h-100 object-fit-cover"
            />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="position-absolute top-0 end-0 m-2"
              onClick={onRemove}
            >
              <X className="me-1" style={{ width: '16px', height: '16px' }} />
              Удалить
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'position-relative d-flex flex-column align-items-center justify-content-center w-100 rounded border border-2 border-dashed p-5 transition-all',
            isDragging && !disabled && !uploading ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary',
            (disabled || uploading) ? 'opacity-50' : 'cursor-pointer'
          )}
          style={{
            aspectRatio: '16/9',
            cursor: (disabled || uploading) ? 'not-allowed' : 'pointer'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleFileSelect}
            disabled={disabled || uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="text-primary mb-2 animate-spin" style={{ width: '48px', height: '48px', animation: 'spin 1s linear infinite' }} />
              <p className="text-secondary mb-1 small">
                Загрузка изображения...
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="text-secondary mb-2" style={{ width: '48px', height: '48px' }} />
              <p className="text-secondary mb-1 small">
                Перетащите изображение сюда
              </p>
              <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>
                или нажмите для выбора файла
              </p>
              <p className="text-secondary mt-2" style={{ fontSize: '0.75rem' }}>
                PNG, JPG, GIF до 5MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
