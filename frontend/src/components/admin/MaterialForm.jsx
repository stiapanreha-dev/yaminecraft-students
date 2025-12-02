import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { FileUpload } from '@/components/ui/file-upload';

const fileSchema = z.object({
  filename: z.string(),
  fileUrl: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
});

const materialSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  description: z.string().min(10, 'Минимум 10 символов').max(2000, 'Максимум 2000 символов'),
  imageUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
  category: z.enum(['METHODOLOGY', 'LESSON_PLAN', 'PRESENTATION', 'WORKSHEET', 'OTHER']),
  files: z.array(fileSchema).min(1, 'Загрузите хотя бы один файл'),
});

const categories = [
  { value: 'METHODOLOGY', label: 'Методические материалы' },
  { value: 'LESSON_PLAN', label: 'Планы уроков' },
  { value: 'PRESENTATION', label: 'Презентации' },
  { value: 'WORKSHEET', label: 'Рабочие листы' },
  { value: 'OTHER', label: 'Другое' },
];

export const MaterialForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      imageUrl: '',
      category: 'METHODOLOGY',
      files: [],
    }
  });

  const imageUrl = watch('imageUrl');
  const files = watch('files');

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Название материала</Form.Label>
            <Form.Control
              type="text"
              placeholder="План урока по робототехнике"
              {...register('title')}
              isInvalid={!!errors.title}
            />
            {errors.title && (
              <Form.Control.Feedback type="invalid">
                {errors.title.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Категория</Form.Label>
            <Form.Select {...register('category')} isInvalid={!!errors.category}>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Подробное описание материала..."
          {...register('description')}
          isInvalid={!!errors.description}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Файлы материала *</Form.Label>
        <FileUpload
          files={files || []}
          onChange={(newFiles) => setValue('files', newFiles, { shouldValidate: true })}
          disabled={loading}
        />
        {errors.files && (
          <div className="text-danger small mt-1">
            {errors.files.message}
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Изображение-превью (опционально)</Form.Label>
        <ImageUpload
          value={imageUrl}
          onChange={(value) => setValue('imageUrl', value)}
          onRemove={() => setValue('imageUrl', '')}
          disabled={loading}
        />
      </Form.Group>

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
