import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Modal, Nav, Badge } from 'react-bootstrap';
import { EventList } from '@/components/events/EventList';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Bot, Trophy, GraduationCap, Wrench, Sparkles, Clock, Building, User } from 'lucide-react';
import { formatDateLong, formatTime } from '@/utils/dateFormatter';
import { useAuth } from '@/hooks/useAuth';
import { eventsApi } from '@/services/api';
import { toast } from 'react-toastify';

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

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  // Открыть мероприятие из query параметра
  useEffect(() => {
    const eventId = searchParams.get('event');
    if (eventId && events.length > 0) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        setSelectedEvent(event);
        setSearchParams({}, { replace: true });
      }
    }
  }, [events, searchParams, setSearchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Ошибка загрузки мероприятий');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    try {
      const response = await eventsApi.getMy();
      setMyEvents(response.data);
    } catch (error) {
      console.error('Error fetching my events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      toast.info('Войдите, чтобы записаться на мероприятие');
      return;
    }

    try {
      setLoadingEventId(eventId);
      await eventsApi.register(eventId);
      toast.success('Вы успешно записались на мероприятие');
      await Promise.all([fetchEvents(), fetchMyEvents()]);
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Ошибка записи на мероприятие');
    } finally {
      setLoadingEventId(null);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      setLoadingEventId(eventId);
      await eventsApi.unregister(eventId);
      toast.success('Запись отменена');
      await Promise.all([fetchEvents(), fetchMyEvents()]);
    } catch (error) {
      console.error('Error unregistering:', error);
      toast.error(error.response?.data?.message || 'Ошибка отмены записи');
    } finally {
      setLoadingEventId(null);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  const registeredEventIds = useMemo(() => {
    return myEvents.map(e => e.id);
  }, [myEvents]);

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter(e => new Date(e.date) >= now);
    const past = events.filter(e => new Date(e.date) < now);

    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    past.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const displayedEvents = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      case 'my':
        return myEvents;
      default:
        return upcomingEvents;
    }
  }, [activeTab, upcomingEvents, pastEvents, myEvents]);

  const emptyMessages = {
    upcoming: { message: 'Нет предстоящих мероприятий', description: 'Следите за обновлениями!' },
    past: { message: 'Нет прошедших мероприятий', description: 'Скоро здесь появится история' },
    my: { message: 'Вы пока не записаны', description: 'Выберите интересное мероприятие и запишитесь!' }
  };

  const selectedEventType = selectedEvent?.eventType ? eventTypeConfig[selectedEvent.eventType] : eventTypeConfig.OTHER;
  const SelectedTypeIcon = selectedEventType.icon;
  const selectedLevel = selectedEvent?.level ? levelConfig[selectedEvent.level] : null;
  const isSelectedRegistered = selectedEvent && registeredEventIds.includes(selectedEvent.id);
  const isSelectedPast = selectedEvent && new Date(selectedEvent.date) < new Date();
  const selectedRegistrationCount = selectedEvent?._count?.registrations || 0;
  const isSelectedFull = selectedEvent?.maxParticipants && selectedRegistrationCount >= selectedEvent.maxParticipants;

  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div>
        <h1 className="display-6 fw-bold mb-2">Мероприятия</h1>
        <p className="text-secondary">
          Мастер-классы, конкурсы и бесплатные занятия по робототехнике
        </p>
      </div>

      {/* Tabs */}
      <Nav variant="pills" className="gap-2 flex-wrap">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'upcoming'}
            onClick={() => setActiveTab('upcoming')}
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
          >
            <Calendar size={18} />
            Предстоящие
            {upcomingEvents.length > 0 && (
              <Badge bg="light" text="dark" pill className="ms-1">
                {upcomingEvents.length}
              </Badge>
            )}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'past'}
            onClick={() => setActiveTab('past')}
            className="d-flex align-items-center gap-2"
            style={{ cursor: 'pointer' }}
          >
            <Clock size={18} />
            Прошедшие
          </Nav.Link>
        </Nav.Item>
        {isAuthenticated && (
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'my'}
              onClick={() => setActiveTab('my')}
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <User size={18} />
              Мои записи
              {myEvents.length > 0 && (
                <Badge bg="accent" text="dark" pill className="ms-1">
                  {myEvents.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
        )}
      </Nav>

      {/* Events List */}
      <EventList
        events={displayedEvents}
        loading={loading}
        onViewDetails={handleViewDetails}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        registeredEvents={registeredEventIds}
        isAuthenticated={isAuthenticated}
        loadingEventId={loadingEventId}
        emptyMessage={emptyMessages[activeTab].message}
        emptyDescription={emptyMessages[activeTab].description}
      />

      {/* Event Details Modal */}
      <Modal show={!!selectedEvent} onHide={handleCloseDialog} size="lg" centered>
        {selectedEvent && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="d-flex align-items-center gap-2">
                <Badge bg={selectedEventType.color} className="d-inline-flex align-items-center gap-1">
                  <SelectedTypeIcon size={14} />
                  {selectedEventType.label}
                </Badge>
                {selectedLevel && (
                  <span
                    className="badge rounded-pill"
                    style={{ backgroundColor: selectedLevel.color, color: 'white' }}
                  >
                    {selectedLevel.label}
                  </span>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Image */}
              {selectedEvent.imageUrl ? (
                <div className="rounded overflow-hidden mb-4" style={{ height: '280px' }}>
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ) : (
                <div className="rounded mb-4 bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                  <Bot size={80} className="text-secondary" style={{ opacity: 0.3 }} />
                </div>
              )}

              {/* Title */}
              <h3 className="fw-bold mb-3">{selectedEvent.title}</h3>

              {/* Info Grid */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                    <Calendar size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <div className="small text-muted">Дата и время</div>
                      <div className="fw-medium">{formatDateLong(selectedEvent.date)}</div>
                      <div>{formatTime(selectedEvent.date)}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                    <MapPin size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <div className="small text-muted">Место проведения</div>
                      <div className="fw-medium">{selectedEvent.location}</div>
                      {selectedEvent.address && <div className="small">{selectedEvent.address}</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                    <Users size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <div className="small text-muted">Участники</div>
                      <div className="fw-medium">
                        {selectedRegistrationCount}
                        {selectedEvent.maxParticipants ? ` / ${selectedEvent.maxParticipants}` : ''} человек
                      </div>
                      {isSelectedFull && <div className="text-danger small">Все места заняты</div>}
                    </div>
                  </div>
                </div>
                {selectedEvent.organizer && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                      <Building size={24} className="text-primary flex-shrink-0" />
                      <div>
                        <div className="small text-muted">Организатор</div>
                        <div className="fw-medium">{selectedEvent.organizer}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Описание</h6>
                <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedEvent.description}
                </p>
              </div>

              {/* Registration Status */}
              {isSelectedRegistered && !isSelectedPast && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <span className="fw-medium">Вы записаны на это мероприятие</span>
                </div>
              )}

              {/* Actions */}
              {!isSelectedPast && (
                <div className="d-flex gap-2">
                  {isSelectedRegistered ? (
                    <Button
                      variant="outline"
                      className="flex-grow-1"
                      disabled={loadingEventId === selectedEvent.id}
                      onClick={() => handleUnregister(selectedEvent.id)}
                    >
                      {loadingEventId === selectedEvent.id ? 'Загрузка...' : 'Отменить запись'}
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      className="flex-grow-1"
                      disabled={!isAuthenticated || isSelectedFull || !selectedEvent.registrationOpen || loadingEventId === selectedEvent.id}
                      onClick={() => handleRegister(selectedEvent.id)}
                    >
                      {loadingEventId === selectedEvent.id ? 'Загрузка...' :
                       !isAuthenticated ? 'Войдите для записи' :
                       isSelectedFull ? 'Мест нет' :
                       !selectedEvent.registrationOpen ? 'Запись закрыта' :
                       'Записаться'}
                    </Button>
                  )}
                </div>
              )}
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};
