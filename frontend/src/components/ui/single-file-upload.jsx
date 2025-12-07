import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, File, FileType } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { uploadsApi } from '@/services/api';

const getFileIcon = (url) => {
  if (!url) return File;
  if (url.includes('.pdf')) return FileType;
  return FileText;
};

const getFileName = (url) => {
  if (!url) return '';
  // Извлекаем имя файла из URL
  const parts = url.split('/');
  return parts[parts.length - 1] || 'Документ';
};

export const SingleFileUpload = ({
  value,
  onChange,
  onRemove,
  disabled,
  accept = '.pdf,.doc,.docx',
  maxSize = 100 * 1024 * 1024, // 100MB
  placeholder = 'Перетащите файл сюда'
}) => {
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

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]);
    }
  };

  const handleFile = async (file) => {
    // Проверяем расширение
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    const allowedExts = accept.split(',').map(e => e.trim().toLowerCase());

    if (!allowedExts.some(allowed => ext === allowed || allowed === '.*')) {
      alert(`Допустимые форматы: ${accept}`);
      return;
    }

    if (file.size > maxSize) {
      alert(`Файл превышает максимальный размер ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    try {
      setUploading(true);
      const result = await uploadsApi.uploadFile(file);
      console.log('SingleFileUpload: uploaded file, URL:', result.url);
      onChange(result.url);
    } catch (error) {
      console.error('SingleFileUpload: upload error:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.();
  };

  const FileIcon = getFileIcon(value);

  // Если файл уже загружен - показываем его
  if (value) {
    return (
      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
        <div className="d-flex align-items-center flex-grow-1 overflow-hidden me-2">
          <FileIcon className="text-primary me-2 flex-shrink-0" size={24} />
          <div className="overflow-hidden">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-truncate small fw-medium text-decoration-none"
              onClick={(e) => e.stopPropagation()}
            >
              {getFileName(value)}
            </a>
          </div>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-shrink-0 p-1"
            onClick={handleRemove}
          >
            <X size={18} className="text-danger" />
          </Button>
        )}
      </div>
    );
  }

  // Зона загрузки
  return (
    <div
      className={cn(
        'position-relative d-flex flex-column align-items-center justify-content-center w-100 rounded border border-2 border-dashed p-4 transition-all',
        isDragging && !disabled && !uploading ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary',
        (disabled || uploading) ? 'opacity-50' : 'cursor-pointer'
      )}
      style={{
        minHeight: '100px',
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
        accept={accept}
        className="d-none"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      {uploading ? (
        <>
          <Loader2 className="text-primary mb-2" style={{ width: '28px', height: '28px', animation: 'spin 1s linear infinite' }} />
          <p className="text-secondary mb-0 small text-center">
            Загрузка...
          </p>
        </>
      ) : (
        <>
          <Upload className="text-secondary mb-2" style={{ width: '28px', height: '28px' }} />
          <p className="text-secondary mb-1 small text-center">
            {placeholder}
          </p>
          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
            или нажмите для выбора
          </p>
        </>
      )}
    </div>
  );
};
