import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/utils/validators';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

const eventTypes = [
  { value: 'MASTER_CLASS', label: 'Мастер-класс' },
  { value: 'COMPETITION', label: 'Конкурс' },
  { value: 'FREE_LESSON', label: 'Бесплатное занятие' },
  { value: 'WORKSHOP', label: 'Воркшоп' },
  { value: 'OTHER', label: 'Другое' },
];

const eventLevels = [
  { value: '', label: 'Не указан' },
  { value: 'SCHOOL', label: 'Школьный' },
  { value: 'DISTRICT', label: 'Районный' },
  { value: 'CITY', label: 'Городской' },
  { value: 'REGIONAL', label: 'Региональный' },
  { value: 'NATIONAL', label: 'Всероссийский' },
  { value: 'INTERNATIONAL', label: 'Международный' },
];

export const EventForm = ({
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
    resolver: zodResolver(eventSchema),
    defaultValues: initialData ? {
      ...initialData,
      date: initialData.date ? new Date(initialData.date) : new Date(),
      eventType: initialData.eventType || 'OTHER',
      level: initialData.level || '',
      maxParticipants: initialData.maxParticipants || '',
      registrationOpen: initialData.registrationOpen !== false,
    } : {
      title: '',
      description: '',
      date: new Date(),
      location: '',
      address: '',
      organizer: '',
      imageUrl: '',
      eventType: 'OTHER',
      level: '',
      maxParticipants: '',
      registrationOpen: true,
    }
  });

  const selectedDate = watch('date');
  const imageUrl = watch('imageUrl');
  const registrationOpen = watch('registrationOpen');

  const handleFormSubmit = async (data) => {
    const submitData = {
      ...data,
      level: data.level || null,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants, 10) : null,
    };

    if (onSubmit) {
      await onSubmit(submitData);
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Title */}
      <Form.Group className="mb-3">
        <Form.Label>Название мероприятия</Form.Label>
        <Form.Control
          type="text"
          placeholder="Мастер-класс по робототехнике"
          {...register('title')}
          isInvalid={!!errors.title}
        />
        {errors.title && (
          <Form.Control.Feedback type="invalid">
            {errors.title.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Event Type and Level */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Тип мероприятия</Form.Label>
            <Form.Select {...register('eventType')} isInvalid={!!errors.eventType}>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
            {errors.eventType && (
              <Form.Control.Feedback type="invalid">
                {errors.eventType.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Уровень</Form.Label>
            <Form.Select {...register('level')}>
              {eventLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Description */}
      <Form.Group className="mb-3">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Подробное описание мероприятия..."
          {...register('description')}
          isInvalid={!!errors.description}
        />
        {errors.description && (
          <Form.Control.Feedback type="invalid">
            {errors.description.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      {/* Date and Location */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Дата и время</Form.Label>
            <div className="position-relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setValue('date', date)}
                locale={ru}
                dateFormat="dd.MM.yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                className="form-control"
                placeholderText="Выберите дату и время"
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
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Место проведения</Form.Label>
            <Form.Control
              type="text"
              placeholder="Кабинет робототехники"
              {...register('location')}
              isInvalid={!!errors.location}
            />
            {errors.location && (
              <Form.Control.Feedback type="invalid">
                {errors.location.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Address */}
      <Form.Group className="mb-3">
        <Form.Label>Адрес (опционально)</Form.Label>
        <Form.Control
          type="text"
          placeholder="ул. Примерная, д. 1"
          {...register('address')}
        />
      </Form.Group>

      {/* Organizer and Max Participants */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Организатор (опционально)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Школа робототехники"
              {...register('organizer')}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Макс. участников (опционально)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Без ограничений"
              {...register('maxParticipants')}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Registration Open */}
      <Form.Group className="mb-3">
        <Form.Check
          type="switch"
          id="registrationOpen"
          label="Запись открыта"
          checked={registrationOpen}
          onChange={(e) => setValue('registrationOpen', e.target.checked)}
        />
        <Form.Text className="text-muted">
          Когда запись закрыта, пользователи не смогут записаться на мероприятие
        </Form.Text>
      </Form.Group>

      {/* Image Upload */}
      <Form.Group className="mb-4">
        <Form.Label>Изображение мероприятия (опционально)</Form.Label>
        <ImageUpload
          value={imageUrl}
          onChange={(value) => setValue('imageUrl', value)}
          onRemove={() => setValue('imageUrl', '')}
          disabled={loading}
        />
        {errors.imageUrl && (
          <div className="text-danger small mt-1">
            {errors.imageUrl.message}
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
