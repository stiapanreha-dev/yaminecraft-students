import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { achievementSchema } from '@/utils/validators';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

/**
 * Форма создания/редактирования достижения
 * @param {Object} initialData - начальные данные для редактирования
 * @param {Array} students - список учеников для выбора
 * @param {Function} onSubmit - callback для отправки формы
 * @param {Function} onCancel - callback для отмены
 * @param {boolean} loading - состояние загрузки
 */
export const AchievementForm = ({
  initialData = null,
  students = [],
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
    resolver: zodResolver(achievementSchema),
    defaultValues: initialData || {
      userId: '',
      title: '',
      description: '',
      category: 'sport',
      points: 0,
      date: new Date(),
      proofUrls: []
    }
  });

  const categories = [
    { value: 'sport', label: 'Спорт' },
    { value: 'study', label: 'Учёба' },
    { value: 'creativity', label: 'Творчество' },
    { value: 'volunteer', label: 'Волонтёрство' },
  ];

  const selectedDate = watch('date');

  const handleFormSubmit = async (data) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Student Selection */}
      <Form.Group className="mb-3">
        <Form.Label>Ученик</Form.Label>
        <Form.Select
          {...register('userId')}
          isInvalid={!!errors.userId}
        >
          <option value="">Выберите ученика</option>
          {students.filter(s => s.role === 'student' || s.role === 'STUDENT').map((student) => (
            <option key={student.uid || student.id} value={student.uid || student.id}>
              {student.profile?.firstName || student.firstName} {student.profile?.lastName || student.lastName}
            </option>
          ))}
        </Form.Select>
        {errors.userId && (
          <Form.Control.Feedback type="invalid" className="d-block">
            {errors.userId.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Название достижения</Form.Label>
        <Form.Control
          type="text"
          placeholder="Победа в соревнованиях"
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
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Подробное описание достижения..."
          {...register('description')}
          isInvalid={!!errors.description}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Category and Points */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Категория</Form.Label>
            <Form.Select
              {...register('category')}
              isInvalid={!!errors.category}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Form.Select>
            {errors.category && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {errors.category.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Баллы</Form.Label>
            <Form.Control
              type="number"
              placeholder="0"
              {...register('points', { valueAsNumber: true })}
              isInvalid={!!errors.points}
            />
            {errors.points && (
              <Form.Control.Feedback type="invalid">
                {errors.points.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Date */}
      <Form.Group className="mb-4">
        <Form.Label>Дата достижения</Form.Label>
        <div className="position-relative">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setValue('date', date)}
            locale={ru}
            dateFormat="dd.MM.yyyy"
            maxDate={new Date()}
            className="form-control"
            placeholderText="Выберите дату"
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
        {errors.date && (
          <div className="text-danger small mt-1">
            {errors.date.message}
          </div>
        )}
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
