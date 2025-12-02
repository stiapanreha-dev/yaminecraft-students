import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { projectsApi } from '@/services/api';

const articleSchema = z.object({
  title: z.string().min(3, 'Минимум 3 символа').max(200, 'Максимум 200 символов'),
  content: z.string().min(50, 'Минимум 50 символов'),
  excerpt: z.string().max(300, 'Максимум 300 символов').optional().or(z.literal('')),
  imageUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
  projectId: z.string().optional().or(z.literal('')),
  published: z.boolean().default(false),
});

export const ArticleForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll();
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      projectId: '',
      published: false,
    }
  });

  const imageUrl = watch('imageUrl');
  const published = watch('published');

  const handleFormSubmit = async (data) => {
    const submitData = {
      ...data,
      projectId: data.projectId || null,
    };
    if (onSubmit) {
      await onSubmit(submitData);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <Form.Label>Заголовок</Form.Label>
            <Form.Control
              type="text"
              placeholder="Название статьи"
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
            <Form.Label>Проект</Form.Label>
            <Form.Select {...register('projectId')}>
              <option value="">Без проекта</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Краткое описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Краткое описание для превью..."
          {...register('excerpt')}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Содержание статьи</Form.Label>
        <Form.Control
          as="textarea"
          rows={12}
          placeholder="Полный текст статьи..."
          {...register('content')}
          isInvalid={!!errors.content}
        />
        {errors.content && (
          <Form.Control.Feedback type="invalid">
            {errors.content.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Изображение (опционально)</Form.Label>
        <ImageUpload
          value={imageUrl}
          onChange={(value) => setValue('imageUrl', value)}
          onRemove={() => setValue('imageUrl', '')}
          disabled={loading}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Check
          type="switch"
          id="published"
          label="Опубликовать"
          checked={published}
          onChange={(e) => setValue('published', e.target.checked)}
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
