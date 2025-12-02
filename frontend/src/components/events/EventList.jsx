import { Row, Col, Spinner } from 'react-bootstrap';
import { EventCard } from './EventCard';
import { Calendar } from 'lucide-react';

export const EventList = ({
  events = [],
  loading = false,
  onViewDetails,
  onRegister,
  onUnregister,
  registeredEvents = [],
  isAuthenticated = false,
  loadingEventId = null,
  emptyMessage = 'Пока нет мероприятий',
  emptyDescription = 'Скоро здесь появятся интересные события'
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-secondary">Загрузка мероприятий...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-5">
        <Calendar size={48} className="text-secondary mb-3 mx-auto d-block" style={{ opacity: 0.5 }} />
        <p className="h5 text-secondary mb-2">{emptyMessage}</p>
        <p className="text-secondary small">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {events.map((event) => {
        const isRegistered = registeredEvents.includes(event.id);

        return (
          <Col key={event.id} xs={12} sm={6} lg={4}>
            <EventCard
              event={event}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
              onUnregister={onUnregister}
              isRegistered={isRegistered}
              isAuthenticated={isAuthenticated}
              loading={loadingEventId === event.id}
            />
          </Col>
        );
      })}
    </Row>
  );
};
