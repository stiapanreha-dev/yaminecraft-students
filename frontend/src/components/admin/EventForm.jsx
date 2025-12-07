import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventSchema } from '@/utils/validators';
import { Form, Row, Col } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { SingleFileUpload } from '@/components/ui/single-file-upload';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

const eventTypes = [
  { value: 'MASTER_CLASS', label: 'Мастер-класс' },
  { value: 'COMPETITION', label: 'Соревнование' },
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

const eventFormats = [
  { value: 'OFFLINE', label: 'Очно' },
  { value: 'ONLINE', label: 'Онлайн' },
  { value: 'HYBRID', label: 'Смешанный' },
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
      endDate: initialData.endDate ? new Date(initialData.endDate) : null,
      eventType: initialData.eventType || 'OTHER',
      eventFormat: initialData.eventFormat || 'OFFLINE',
      level: initialData.level || '',
      maxParticipants: initialData.maxParticipants || '',
      registrationOpen: initialData.registrationOpen !== false,
      documentUrl: initialData.documentUrl || '',
      phone: initialData.phone || '',
      prizePool: initialData.prizePool || '',
    } : {
      title: '',
      description: '',
      date: new Date(),
      endDate: null,
      location: '',
      address: '',
      organizer: '',
      imageUrl: '',
      documentUrl: '',
      eventType: 'OTHER',
      eventFormat: 'OFFLINE',
      level: '',
      maxParticipants: '',
      registrationOpen: true,
      phone: '',
      prizePool: '',
    }
  });

  const selectedDate = watch('date');
  const endDate = watch('endDate');
  const imageUrl = watch('imageUrl');
  const documentUrl = watch('documentUrl');
  const registrationOpen = watch('registrationOpen');

  const handleFormSubmit = async (data) => {
    const submitData = {
      ...data,
      level: data.level || null,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants, 10) : null,
      endDate: data.endDate || null,
      documentUrl: data.documentUrl || null,
      phone: data.phone || null,
      prizePool: data.prizePool || null,
    };

    console.log('EventForm: submitting data:', submitData);
    console.log('EventForm: documentUrl =', submitData.documentUrl);

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

      {/* Event Type, Level and Format */}
      <Row className="mb-3">
        <Col md={4}>
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
        <Col md={4}>
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
        <Col md={4}>
          <Form.Group>
            <Form.Label>Формат</Form.Label>
            <Form.Select {...register('eventFormat')}>
              {eventFormats.map((format) => (
                <option key={format.value} value={format.value}>
                  {format.label}
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

      {/* Start Date and End Date */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Дата начала</Form.Label>
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
            <Form.Label>Дата окончания (опционально)</Form.Label>
            <div className="position-relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => setValue('endDate', date)}
                locale={ru}
                dateFormat="dd.MM.yyyy HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                className="form-control"
                placeholderText="Если многодневное"
                isClearable
              />
              <CalendarIcon
                className="position-absolute text-secondary"
                style={{
                  right: '32px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      {/* Location */}
      <Form.Group className="mb-3">
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

      {/* Address */}
      <Form.Group className="mb-3">
        <Form.Label>Адрес (опционально)</Form.Label>
        <Form.Control
          type="text"
          placeholder="ул. Примерная, д. 1"
          {...register('address')}
        />
      </Form.Group>

      {/* Organizer and Phone */}
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
            <Form.Label>Телефон для записи (опционально)</Form.Label>
            <Form.Control
              type="tel"
              placeholder="+7 (XXX) XXX-XX-XX"
              {...register('phone')}
            />
            <Form.Text className="text-muted">
              Для мастер-классов и бесплатных занятий
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* Max Participants and Prize Pool */}
      <Row className="mb-3">
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
        <Col md={6}>
          <Form.Group>
            <Form.Label>Призовой фонд (опционально)</Form.Label>
            <Form.Control
              type="text"
              placeholder="100 000 руб."
              {...register('prizePool')}
            />
            <Form.Text className="text-muted">
              Для соревнований с призами
            </Form.Text>
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
      <Form.Group className="mb-3">
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

      {/* Document Upload */}
      <Form.Group className="mb-4">
        <Form.Label>Положение о мероприятии (опционально)</Form.Label>
        <SingleFileUpload
          value={documentUrl}
          onChange={(value) => setValue('documentUrl', value)}
          onRemove={() => setValue('documentUrl', '')}
          disabled={loading}
          accept=".pdf,.doc,.docx"
          placeholder="Загрузите положение или регламент"
        />
        <Form.Text className="text-muted">
          PDF, DOC, DOCX до 100MB
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
