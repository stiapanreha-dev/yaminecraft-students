import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Nav, Table, Form, Spinner, Modal } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import {
  Calendar, MapPin, Users, Bot, Trophy, GraduationCap, Wrench, Sparkles,
  Building, FileText, Download, ArrowLeft, Monitor, Globe, Clock, Phone, Gift
} from 'lucide-react';
import { formatDateLong, formatTime } from '@/utils/dateFormatter';
import { useAuth } from '@/hooks/useAuth';
import { eventsApi } from '@/services/api';
import { toast } from 'react-toastify';

const eventTypeConfig = {
  MASTER_CLASS: { label: 'Мастер-класс', icon: GraduationCap, color: 'primary' },
  COMPETITION: { label: 'Соревнование', icon: Trophy, color: 'warning' },
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

const formatConfig = {
  OFFLINE: { label: 'Очно', icon: Building },
  ONLINE: { label: 'Онлайн', icon: Monitor },
  HYBRID: { label: 'Смешанный', icon: Globe },
};

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [organization, setOrganization] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      fetchRegistrations();
    }
  }, [event]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Ошибка загрузки мероприятия');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await eventsApi.getRegistrations(id);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Войдите, чтобы записаться на мероприятие');
      return;
    }

    try {
      setRegistering(true);
      await eventsApi.register(id, { organization: organization || undefined });
      toast.success('Вы успешно записались на мероприятие');
      await fetchEvent();
      await fetchRegistrations();
      setOrganization('');
    } catch (error) {
      console.error('Error registering:', error);
      toast.error(error.response?.data?.message || 'Ошибка записи на мероприятие');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setRegistering(true);
      await eventsApi.unregister(id);
      toast.success('Запись отменена');
      await fetchEvent();
      await fetchRegistrations();
    } catch (error) {
      console.error('Error unregistering:', error);
      toast.error(error.response?.data?.message || 'Ошибка отмены записи');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Загрузка...</p>
      </Container>
    );
  }

  if (!event) {
    return null;
  }

  const eventType = eventTypeConfig[event.eventType] || eventTypeConfig.OTHER;
  const TypeIcon = eventType.icon;
  const level = event.level ? levelConfig[event.level] : null;
  const format = event.eventFormat ? formatConfig[event.eventFormat] : formatConfig.OFFLINE;
  const FormatIcon = format.icon;

  const isPast = new Date(event.date) < new Date();
  const isRegistered = event.isRegistered;
  const registrationCount = event._count?.registrations || registrations.length;
  const isFull = event.maxParticipants && registrationCount >= event.maxParticipants;
  const isCompetition = event.eventType === 'COMPETITION';
  const isPhoneRegistration = event.eventType === 'MASTER_CLASS' || event.eventType === 'FREE_LESSON';

  const getFullName = (reg) => {
    const user = reg.user;
    const parts = [user.lastName, user.firstName, user.middleName].filter(Boolean);
    return parts.join(' ') || 'Без имени';
  };

  return (
    <Container className="py-4">
      {/* Back button */}
      <Link to="/events" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-4">
        <ArrowLeft size={20} />
        <span>Назад к мероприятиям</span>
      </Link>

      {/* Header Card */}
      <Card className="mb-4 border-0 shadow-sm" style={{ backgroundColor: '#69C5F8' }}>
        <Card.Body className="p-4">
          <Row className="g-4">
            {/* Left: Image */}
            <Col md={4}>
              {event.imageUrl ? (
                <div className="rounded overflow-hidden" style={{ height: '250px' }}>
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ) : (
                <div className="rounded d-flex align-items-center justify-content-center" style={{ height: '250px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <Bot size={80} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
              )}
            </Col>

            {/* Right: Info */}
            <Col md={8}>
              {/* Badges */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg={eventType.color} className="d-inline-flex align-items-center gap-1">
                  <TypeIcon size={14} />
                  {eventType.label}
                </Badge>
                {level && (
                  <span className="badge" style={{ backgroundColor: level.color, color: 'white' }}>
                    {level.label}
                  </span>
                )}
                <Badge bg="dark" className="d-inline-flex align-items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <FormatIcon size={14} />
                  {format.label}
                </Badge>
                {event.prizePool && (
                  <Badge bg="warning" className="d-inline-flex align-items-center gap-1 text-dark">
                    <Gift size={14} />
                    {event.prizePool}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h2 className="fw-bold mb-3" style={{ color: 'white' }}>{event.title}</h2>

              {/* Info Grid */}
              <Row className="g-3">
                <Col sm={6}>
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Calendar size={18} style={{ color: 'var(--bs-accent)' }} />
                    <div>
                      <div className="fw-medium" style={{ color: 'white' }}>{formatDateLong(event.date)}</div>
                      <div className="small">{formatTime(event.date)}</div>
                      {event.endDate && (
                        <div className="small">до {formatDateLong(event.endDate)}</div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <MapPin size={18} style={{ color: 'var(--bs-accent)' }} />
                    <div>
                      <div className="fw-medium" style={{ color: 'white' }}>{event.location || 'Место уточняется'}</div>
                      {event.address && <div className="small">{event.address}</div>}
                    </div>
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    <Users size={18} style={{ color: 'var(--bs-accent)' }} />
                    <div>
                      <div className="fw-medium" style={{ color: 'white' }}>
                        {registrationCount}
                        {event.maxParticipants ? ` / ${event.maxParticipants}` : ''} участников
                      </div>
                      {isFull && <div className="small text-danger">Все места заняты</div>}
                    </div>
                  </div>
                </Col>
                {event.organizer && (
                  <Col sm={6}>
                    <div className="d-flex align-items-center gap-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <Building size={18} style={{ color: 'var(--bs-accent)' }} />
                      <div>
                        <div className="fw-medium" style={{ color: 'white' }}>{event.organizer}</div>
                        <div className="small">Организатор</div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>

              {/* Document Download */}
              {event.documentUrl && (
                <div className="mt-3">
                  <a
                    href={event.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-light d-inline-flex align-items-center gap-2"
                  >
                    <FileText size={18} />
                    Скачать положение
                    <Download size={16} />
                  </a>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Nav variant="pills" className="nav-pills-accent gap-2 mb-4">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
            style={{ cursor: 'pointer' }}
          >
            Описание
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'participants'}
            onClick={() => setActiveTab('participants')}
            style={{ cursor: 'pointer' }}
          >
            Участники ({registrationCount})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      {activeTab === 'description' ? (
        <Row className="g-4">
          {/* Description */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Описание мероприятия</h5>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {event.description || 'Описание отсутствует'}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Registration Form */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ top: '80px' }}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Регистрация</h5>

                {isPast ? (
                  <div className="alert alert-secondary mb-0">
                    <Clock size={18} className="me-2" />
                    Мероприятие уже прошло
                  </div>
                ) : isRegistered ? (
                  <>
                    <div className="alert alert-success mb-3">
                      Вы записаны на это мероприятие
                    </div>
                    <Button
                      variant="outline"
                      className="w-100"
                      disabled={registering}
                      onClick={handleUnregister}
                    >
                      {registering ? 'Загрузка...' : 'Отменить запись'}
                    </Button>
                  </>
                ) : !isAuthenticated ? (
                  <div className="text-center">
                    <p className="text-muted mb-3">Войдите, чтобы записаться на мероприятие</p>
                    <Link to="/login">
                      <Button variant="accent" className="w-100">Войти</Button>
                    </Link>
                  </div>
                ) : !event.registrationOpen ? (
                  <div className="alert alert-warning mb-0">
                    Регистрация закрыта
                  </div>
                ) : isFull ? (
                  <div className="alert alert-warning mb-0">
                    Все места заняты
                  </div>
                ) : isCompetition ? (
                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label>ФИО</Form.Label>
                      <Form.Control
                        type="text"
                        value={`${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`.trim()}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Данные из вашего профиля
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Образовательная организация</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Введите название школы/учреждения"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="accent"
                      className="w-100"
                      disabled={registering}
                    >
                      {registering ? 'Загрузка...' : 'Записаться'}
                    </Button>
                  </Form>
                ) : isPhoneRegistration ? (
                  <Button
                    variant="accent"
                    className="w-100"
                    onClick={() => setShowPhoneModal(true)}
                  >
                    Записаться
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    className="w-100"
                    onClick={() => setShowPhoneModal(true)}
                  >
                    Записаться
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Список участников</h5>
            {registrations.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <Users size={48} className="mb-3" style={{ opacity: 0.3 }} />
                <p>Пока нет зарегистрированных участников</p>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ФИО участника</th>
                    {isCompetition && <th>Образовательная организация</th>}
                    <th>Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, index) => (
                    <tr key={reg.id}>
                      <td>{index + 1}</td>
                      <td>{getFullName(reg)}</td>
                      {isCompetition && <td>{reg.organization || '-'}</td>}
                      <td>{new Date(reg.createdAt).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Phone Registration Modal */}
      <Modal show={showPhoneModal} onHide={() => setShowPhoneModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Запись на мероприятие</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <Phone size={48} className="text-primary mb-3" />
          <p className="mb-3">
            Запись на данное мероприятие осуществляется по телефону
          </p>
          {event?.phone ? (
            <a
              href={`tel:${event.phone.replace(/[^\d+]/g, '')}`}
              className="fs-4 fw-bold text-primary text-decoration-none d-block"
            >
              {event.phone}
            </a>
          ) : (
            <p className="text-muted">Телефон не указан</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setShowPhoneModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
