import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Row, Col, Badge, Spinner, ProgressBar } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { CalendarIcon, X, Users, Paperclip, FileText, Trash2 } from 'lucide-react';
import { usersApi, uploadsApi } from '@/services/api';
import { toast } from 'react-toastify';

const homeworkSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(150, 'Максимум 150 символов'),
  description: z.string().min(10, 'Минимум 10 символов').max(5000, 'Максимум 5000 символов'),
  dueDate: z.date({
    required_error: 'Срок сдачи обязателен',
    invalid_type_error: 'Некорректная дата'
  }),
});

export const HomeworkForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [assignToAll, setAssignToAll] = useState(true);
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(homeworkSchema),
    defaultValues: initialData ? {
      ...initialData,
      dueDate: initialData.dueDate ? new Date(initialData.dueDate) : new Date(),
    } : {
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
    }
  });

  const selectedDate = watch('dueDate');

  // Load students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const response = await usersApi.getStudents();
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Initialize selected students from initialData
  useEffect(() => {
    if (initialData?.assignments && initialData.assignments.length > 0) {
      setAssignToAll(false);
      setSelectedStudentIds(initialData.assignments.map(a => a.studentId || a.student?.id));
    } else {
      setAssignToAll(true);
      setSelectedStudentIds([]);
    }
  }, [initialData]);

  // Initialize files from initialData
  useEffect(() => {
    if (initialData?.files && initialData.files.length > 0) {
      setFiles(initialData.files);
    } else {
      setFiles([]);
    }
  }, [initialData]);

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    setUploadingFile(true);
    try {
      for (const file of selectedFiles) {
        const result = await uploadsApi.uploadFile(file);
        setFiles(prev => [...prev, {
          filename: file.name,
          fileUrl: result.url,
          fileSize: file.size,
          fileType: file.type,
        }]);
      }
      toast.success('Файлы загружены');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Ошибка загрузки файла');
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit({
        ...data,
        studentIds: assignToAll ? [] : selectedStudentIds,
        files: files.map(f => ({
          filename: f.filename,
          fileUrl: f.fileUrl,
          fileSize: f.fileSize,
          fileType: f.fileType,
        })),
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Название задания</Form.Label>
        <Form.Control
          type="text"
          placeholder="Например: Создание робота-манипулятора"
          {...register('title')}
          isInvalid={!!errors.title}
        />
        {errors.title && (
          <Form.Control.Feedback type="invalid">
            {errors.title.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label>Описание задания</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          placeholder="Подробное описание задания, требования и критерии оценки..."
          {...register('description')}
          isInvalid={!!errors.description}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
        <Form.Text className="text-muted">
          Опишите задание подробно. Можно использовать markdown для форматирования.
        </Form.Text>
      </Form.Group>

      {/* Due Date */}
      <Form.Group className="mb-4">
        <Form.Label>Срок сдачи</Form.Label>
        <div className="position-relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setValue('dueDate', date)}
            locale={ru}
            dateFormat="dd.MM.yyyy HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            minDate={new Date()}
            className="form-control"
            placeholderText="Выберите срок сдачи"
          />
          <CalendarIcon
            className="position-absolute text-secondary"
            style={{
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '16px',
              height: '16px',
              pointerEvents: 'none'
            }}
          />
        </div>
        {errors.dueDate && (
          <div className="text-danger small mt-1">
            {errors.dueDate.message}
          </div>
        )}
      </Form.Group>

      {/* Student Assignment */}
      <Form.Group className="mb-4">
        <Form.Label className="d-flex align-items-center gap-2">
          <Users style={{ width: '16px', height: '16px' }} />
          Назначить ученикам
        </Form.Label>

        <div className="mb-3">
          <Form.Check
            type="radio"
            id="assignAll"
            name="assignmentType"
            label="Всем ученикам"
            checked={assignToAll}
            onChange={() => {
              setAssignToAll(true);
              setSelectedStudentIds([]);
            }}
          />
          <Form.Check
            type="radio"
            id="assignSelected"
            name="assignmentType"
            label="Выбранным ученикам"
            checked={!assignToAll}
            onChange={() => setAssignToAll(false)}
          />
        </div>

        {!assignToAll && (
          <div className="border rounded p-3">
            {loadingStudents ? (
              <div className="text-center py-3">
                <Spinner size="sm" animation="border" className="me-2" />
                Загрузка учеников...
              </div>
            ) : students.length === 0 ? (
              <p className="text-secondary text-center mb-0">Нет учеников</p>
            ) : (
              <>
                {/* Selected students badges */}
                {selectedStudentIds.length > 0 && (
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    {selectedStudentIds.map(id => {
                      const student = students.find(s => s.id === id);
                      if (!student) return null;
                      return (
                        <Badge
                          key={id}
                          bg="primary"
                          className="d-flex align-items-center gap-1 py-2 px-2"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleStudentToggle(id)}
                        >
                          {student.lastName} {student.firstName}
                          <X style={{ width: '14px', height: '14px' }} />
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {/* Student list with checkboxes */}
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {students.map(student => (
                    <Form.Check
                      key={student.id}
                      type="checkbox"
                      id={`student-${student.id}`}
                      label={`${student.lastName} ${student.firstName}${student.class ? ` (${student.class} класс)` : ''}`}
                      checked={selectedStudentIds.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="mb-1"
                    />
                  ))}
                </div>

                <div className="mt-2 small text-secondary">
                  Выбрано: {selectedStudentIds.length} из {students.length}
                </div>
              </>
            )}
          </div>
        )}
      </Form.Group>

      {/* File Attachments */}
      <Form.Group className="mb-4">
        <Form.Label className="d-flex align-items-center gap-2">
          <Paperclip style={{ width: '16px', height: '16px' }} />
          Прикреплённые материалы
        </Form.Label>

        {/* File list */}
        {files.length > 0 && (
          <div className="mb-3">
            {files.map((file, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-2 p-2 border rounded mb-2"
              >
                <FileText style={{ width: '20px', height: '20px' }} className="text-secondary flex-shrink-0" />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="text-truncate fw-medium" style={{ fontSize: '0.9rem' }}>
                    {file.filename}
                  </div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                    {formatFileSize(file.fileSize)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="p-1"
                >
                  <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          className="d-none"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingFile}
          className="w-100"
        >
          {uploadingFile ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Загрузка...
            </>
          ) : (
            <>
              <Paperclip style={{ width: '16px', height: '16px' }} className="me-2" />
              Добавить файлы
            </>
          )}
        </Button>
        <Form.Text className="text-muted">
          Поддерживаемые форматы: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, PNG, JPG, GIF, WebP
        </Form.Text>
      </Form.Group>

      {/* Actions */}
      <div className="d-flex justify-content-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </Form>
  );
};
