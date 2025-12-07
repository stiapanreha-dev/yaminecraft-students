import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Bot, Trophy, GraduationCap, Wrench, Sparkles, Gift } from 'lucide-react';
import { formatDateLong, formatTime } from '@/utils/dateFormatter';

const eventTypeConfig = {
  MASTER_CLASS: { label: 'Мастер-класс', icon: GraduationCap, color: 'primary' },
  COMPETITION: { label: 'Конкурс', icon: Trophy, color: 'warning' },
  FREE_LESSON: { label: 'Бесплатное занятие', icon: Bot, color: 'success' },
  WORKSHOP: { label: 'Воркшоп', icon: Wrench, color: 'info' },
  OTHER: { label: 'Мероприятие', icon: Sparkles, color: 'secondary' },
};

const levelConfig = {
  SCHOOL: { label: 'Школьный', color: '#6B7280' },
  DISTRICT: { label: 'Районный', color: '#3B82F6' },
  CITY: { label: 'Городской', color: '#10B981' },
  REGIONAL: { label: 'Региональный', color: '#F59E0B' },
  NATIONAL: { label: 'Всероссийский', color: '#EF4444' },
  INTERNATIONAL: { label: 'Международный', color: '#8B5CF6' },
};

export const EventCard = ({
  event,
  onViewDetails,
  onRegister,
  onUnregister,
  isRegistered = false,
  isAuthenticated = false,
  loading = false
}) => {
  if (!event) return null;

  const {
    title,
    description,
    date,
    location,
    address,
    organizer,
    imageUrl,
    eventType = 'OTHER',
    level,
    maxParticipants,
    registrationOpen = true,
    prizePool,
    _count
  } = event;

  const registrationCount = _count?.registrations || 0;
  const isPast = new Date(date) < new Date();
  const isFull = maxParticipants && registrationCount >= maxParticipants;
  const canRegister = !isPast && registrationOpen && !isFull && isAuthenticated;

  const typeConfig = eventTypeConfig[eventType] || eventTypeConfig.OTHER;
  const TypeIcon = typeConfig.icon;
  const levelInfo = level ? levelConfig[level] : null;

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (isRegistered) {
      onUnregister?.(event.id);
    } else {
      onRegister?.(event.id);
    }
  };

  return (
    <Link to={`/events/${event.id}`} className="text-decoration-none">
    <Card
      className="h-100 overflow-hidden event-card border-0"
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'var(--bs-primary)',
        color: 'white'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image with level badge */}
      <div className="position-relative" style={{ height: '180px' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-100 h-100 object-fit-cover"
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
            <Bot size={64} className="text-secondary opacity-50" />
          </div>
        )}

        {/* Level badge */}
        {levelInfo && (
          <div
            className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill text-white small fw-medium"
            style={{ backgroundColor: levelInfo.color }}
          >
            {levelInfo.label}
          </div>
        )}

        {/* Past event overlay */}
        {isPast && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
               style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <span className="text-white fw-bold fs-5">Завершено</span>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Event type badge */}
        <div className="mb-2 d-flex flex-wrap gap-1">
          <Badge bg={typeConfig.color} className="d-inline-flex align-items-center gap-1">
            <TypeIcon size={14} />
            {typeConfig.label}
          </Badge>
          {prizePool && (
            <Badge bg="warning" className="d-inline-flex align-items-center gap-1 text-dark">
              <Gift size={14} />
              {prizePool}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h5 className="fw-bold mb-2 text-white" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {title}
        </h5>

        {/* Description */}
        <p className="small mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          opacity: 0.9
        }}>
          {description}
        </p>

        {/* Info */}
        <div className="d-flex flex-column gap-2 mb-3 mt-auto">
          <div className="d-flex align-items-center small" style={{ opacity: 0.9 }}>
            <Calendar size={16} className="me-2 flex-shrink-0 text-white" />
            <span>{formatDateLong(date)} в {formatTime(date)}</span>
          </div>

          <div className="d-flex align-items-center small" style={{ opacity: 0.9 }}>
            <MapPin size={16} className="me-2 flex-shrink-0 text-white" />
            <span className="text-truncate">{address || location}</span>
          </div>

          <div className="d-flex align-items-center small" style={{ opacity: 0.9 }}>
            <Users size={16} className="me-2 flex-shrink-0 text-white" />
            <span>
              {registrationCount}
              {maxParticipants ? ` / ${maxParticipants}` : ''} участников
            </span>
          </div>
        </div>

        {/* Organizer */}
        {organizer && (
          <p className="small mb-3" style={{ opacity: 0.8 }}>
            Организатор: <span className="fw-medium">{organizer}</span>
          </p>
        )}

        {/* Registration button */}
        {!isPast && (
          <Button
            variant={isRegistered ? 'outline' : 'accent'}
            className="w-100"
            disabled={(!canRegister && !isRegistered) || loading}
            onClick={handleRegisterClick}
          >
            {loading ? (
              'Загрузка...'
            ) : isRegistered ? (
              'Отменить запись'
            ) : !isAuthenticated ? (
              'Войдите для записи'
            ) : isFull ? (
              'Мест нет'
            ) : !registrationOpen ? (
              'Запись закрыта'
            ) : (
              'Записаться'
            )}
          </Button>
        )}

        {/* Details button for past events */}
        {isPast && (
          <Button variant="outline" className="w-100">
            Подробнее
          </Button>
        )}
      </Card.Body>
    </Card>
    </Link>
  );
};
