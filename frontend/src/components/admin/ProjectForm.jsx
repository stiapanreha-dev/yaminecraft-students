import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';

const projectSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(100, 'Максимум 100 символов'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Введите цвет в формате #RRGGBB'),
  description: z.string().max(500, 'Максимум 500 символов').optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
];

export const ProjectForm = ({
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
    watch,
    reset
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      color: '#69C5F8',
      description: '',
      imageUrl: '',
    }
  });

  // Сбрасываем форму при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        color: initialData.color || '#69C5F8',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
      });
    } else {
      reset({
        name: '',
        color: '#69C5F8',
        description: '',
        imageUrl: '',
      });
    }
  }, [initialData, reset]);

  const color = watch('color');
  const imageUrl = watch('imageUrl');

  const handleFormSubmit = async (data) => {
    console.log('ProjectForm submit:', data);
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Название проекта</Form.Label>
        <Form.Control
          type="text"
          placeholder="Робот-манипулятор"
          {...register('name')}
          isInvalid={!!errors.name}
        />
        {errors.name && (
          <Form.Control.Feedback type="invalid">
            {errors.name.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Цвет проекта</Form.Label>
        <div className="d-flex align-items-center gap-3">
          <Form.Control
            type="color"
            {...register('color')}
            style={{ width: '60px', height: '40px', padding: '4px' }}
          />
          <Form.Control
            type="text"
            {...register('color')}
            style={{ width: '120px' }}
            isInvalid={!!errors.color}
          />
        </div>
        <div className="d-flex gap-2 mt-2">
          {defaultColors.map((c) => (
            <button
              key={c}
              type="button"
              className="rounded-circle border-0"
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: c,
                cursor: 'pointer',
                outline: color === c ? '2px solid var(--bs-dark)' : 'none',
                outlineOffset: '2px'
              }}
              onClick={() => setValue('color', c)}
            />
          ))}
        </div>
        {errors.color && (
          <div className="text-danger small mt-1">{errors.color.message}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Описание (опционально)</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Описание проекта..."
          {...register('description')}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Изображение (опционально)</Form.Label>
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
