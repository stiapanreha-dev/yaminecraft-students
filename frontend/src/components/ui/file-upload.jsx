import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, Plus, File, FileImage, FileType } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { uploadsApi } from '@/services/api';

const ALLOWED_EXTENSIONS = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType) => {
  if (!mimeType) return File;
  if (mimeType.includes('pdf')) return FileType;
  if (mimeType.includes('image')) return FileImage;
  return FileText;
};

export const FileUpload = ({ files = [], onChange, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
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
    handleFiles(droppedFiles);
  };

  const handleFiles = async (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });

    if (validFiles.length === 0) {
      alert('Выберите файлы допустимого формата: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX или изображения');
      return;
    }

    const oversizedFiles = validFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`Некоторые файлы превышают максимальный размер 100MB`);
      return;
    }

    try {
      setUploading(true);
      const uploadedFiles = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        setUploadProgress(`Загрузка ${i + 1}/${validFiles.length}: ${file.name}`);

        const result = await uploadsApi.uploadFile(file);
        uploadedFiles.push({
          filename: result.filename,
          fileUrl: result.url,
          fileSize: result.size,
          fileType: result.mimeType,
        });
      }

      onChange([...files, ...uploadedFiles]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // Сбрасываем input для возможности повторной загрузки того же файла
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="mb-3">
      {/* Список загруженных файлов */}
      {files.length > 0 && (
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Загруженные файлы ({files.length}):</small>
          <div className="d-flex flex-column gap-2">
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file.fileType);
              return (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between p-2 border rounded bg-light"
                >
                  <div className="d-flex align-items-center flex-grow-1 overflow-hidden me-2">
                    <FileIcon className="text-secondary me-2 flex-shrink-0" size={20} />
                    <div className="overflow-hidden">
                      <div className="text-truncate small fw-medium">{file.filename}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {formatFileSize(file.fileSize)}
                      </div>
                    </div>
                  </div>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 p-1"
                      onClick={() => handleRemove(index)}
                    >
                      <X size={16} className="text-danger" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag & Drop зона */}
      <div
        className={cn(
          'position-relative d-flex flex-column align-items-center justify-content-center w-100 rounded border border-2 border-dashed p-4 transition-all',
          isDragging && !disabled && !uploading ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary',
          (disabled || uploading) ? 'opacity-50' : 'cursor-pointer'
        )}
        style={{
          minHeight: '120px',
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
          accept={ALLOWED_EXTENSIONS}
          multiple
          className="d-none"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />
        {uploading ? (
          <>
            <Loader2 className="text-primary mb-2" style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
            <p className="text-secondary mb-0 small text-center">
              {uploadProgress || 'Загрузка...'}
            </p>
          </>
        ) : (
          <>
            <Upload className="text-secondary mb-2" style={{ width: '32px', height: '32px' }} />
            <p className="text-secondary mb-1 small text-center">
              {files.length > 0 ? 'Добавить ещё файл' : 'Перетащите файлы сюда'}
            </p>
            <p className="text-secondary mb-0" style={{ fontSize: '0.75rem' }}>
              или нажмите для выбора
            </p>
            <p className="text-muted mt-2 text-center" style={{ fontSize: '0.7rem' }}>
              PDF, DOC, PPT, XLS, изображения до 100MB
            </p>
          </>
        )}
      </div>

      {/* Кнопка добавления файла (если уже есть файлы) */}
      {files.length > 0 && !uploading && !disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-100"
          onClick={handleClick}
        >
          <Plus size={16} className="me-1" />
          Добавить ещё файл
        </Button>
      )}
    </div>
  );
};
