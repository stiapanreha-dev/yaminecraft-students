import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users, TrendingUp, Bot, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { StudentCard } from '@/components/student/StudentCard';
import { useAuth } from '@/hooks/useAuth';
import { usersApi, articlesApi, eventsApi } from '@/services/api';
import { formatDateLong, formatRelativeDate } from '@/utils/dateFormatter';

// Определяет, нужен ли тёмный текст на данном фоне
const isLightColor = (hexColor) => {
  if (!hexColor) return true;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

export const HomePage = () => {
  const { students, loading } = useStudents({ limitCount: 6 });
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ students: 0, achievements: 0, events: 0 });
  const [latestArticles, setLatestArticles] = useState([]);
  const [upcomingEvent, setUpcomingEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, articlesRes, eventsRes] = await Promise.all([
          usersApi.getStats(),
          articlesApi.getLatest(2),
          eventsApi.getAll()
        ]);
        setStats(statsRes.data);
        setLatestArticles(articlesRes.data);

        // Ближайшее мероприятие - первое незавершённое (дата >= сегодня)
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Сбрасываем время до начала дня
        const upcoming = eventsRes.data
          .filter(e => new Date(e.date) >= now)
          .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
        setUpcomingEvent(upcoming);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Trophy,
      title: 'Рейтинг достижений',
      description: 'Следите за успехами учеников и мотивируйте их к новым свершениям',
      link: '/rating'
    },
    {
      icon: Calendar,
      title: 'Мероприятия',
      description: 'Мастер-классы, конкурсы и бесплатные занятия по робототехнике',
      link: '/events'
    },
    {
      icon: BookOpen,
      title: 'Блог проектов',
      description: 'Статьи о наших проектах и достижениях в робототехнике',
      link: '/blog'
    },
    {
      icon: GraduationCap,
      title: 'Для педагогов',
      description: 'Методические материалы, планы уроков и презентации',
      link: '/materials'
    },
  ];

  const statsDisplay = [
    { label: 'Учеников', value: stats.students },
    { label: 'Достижений', value: stats.achievements },
    { label: 'Мероприятий', value: stats.events },
    { label: 'Категорий', value: 4 },
  ];

  return (
    <div className="d-flex flex-column gap-5">
      {/* Hero Section with Background Image - Full Width */}
      <section
        className="position-relative text-center text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-robot.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '450px',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: '-1.5rem',
          width: '100vw',
        }}
      >
        {/* Dark overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        />

        {/* Content */}
        <div className="position-relative py-5 px-4 d-flex flex-column align-items-center justify-content-center h-100" style={{ zIndex: 1, minHeight: '450px' }}>
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--bs-accent)',
            }}
          >
            <Bot size={48} className="text-dark" />
          </div>
          <h1 className="display-4 fw-bold mb-3">
            Школа робототехники
          </h1>
          <p className="lead mb-4" style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
            Учимся создавать роботов, участвуем в конкурсах и развиваем навыки будущего
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
            <Link to="/events">
              <Button size="lg" variant="accent">
                Записаться на занятие
              </Button>
            </Link>
            <Link to="/blog">
              <Button size="lg" variant="outline" className="text-white border-white">
                Наши проекты
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <Row className="g-3">
          {statsDisplay.map((stat, index) => (
            <Col key={index} xs={6} md={3}>
              <Card className="h-100 text-center">
                <Card.Body className="py-4">
                  <div className="h2 fw-bold mb-2" style={{ color: 'var(--bs-primary)' }}>{stat.value}</div>
                  <p className="text-secondary small mb-0">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Upcoming Event Section */}
      {upcomingEvent && (
        <section>
          <Card className="overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--bs-primary) 0%, #4BA8E0 100%)' }}>
            <Card.Body className="p-4 p-md-5">
              <Row className="align-items-center">
                <Col md={8}>
                  <Badge bg="light" text="dark" className="mb-3">Ближайшее мероприятие</Badge>
                  <h2 className="fw-bold text-white mb-2">{upcomingEvent.title}</h2>
                  <p className="text-white mb-3" style={{ opacity: 0.9 }}>
                    {upcomingEvent.description?.substring(0, 150)}...
                  </p>
                  <div className="d-flex flex-wrap gap-3 text-white mb-4" style={{ opacity: 0.9 }}>
                    <span><Calendar size={18} className="me-2" />{formatDateLong(upcomingEvent.date)}</span>
                    <span>{upcomingEvent.location}</span>
                  </div>
                  <Link to={`/events?event=${upcomingEvent.id}`}>
                    <Button variant="accent">
                      Подробнее
                      <ArrowRight size={18} className="ms-2" />
                    </Button>
                  </Link>
                </Col>
                <Col md={4} className="d-none d-md-block text-center">
                  <Bot size={150} className="text-white" style={{ opacity: 0.3 }} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </section>
      )}

      {/* Latest Articles Section */}
      {latestArticles.length > 0 && (
        <section>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 fw-bold mb-1">Последние статьи</h2>
              <p className="text-secondary mb-0">Новости и проекты нашей школы</p>
            </div>
            <Link to="/blog">
              <Button variant="outline" size="sm">
                Все статьи <ArrowRight size={16} className="ms-1" />
              </Button>
            </Link>
          </div>

          <Row className="g-4">
            {latestArticles.map((article) => {
              const bgColor = article.project?.color || '#fff';
              const lightBg = isLightColor(bgColor);
              const textColor = lightBg ? '#212529' : '#fff';
              const textColorMuted = lightBg ? '#6c757d' : 'rgba(255,255,255,0.8)';

              return (
                <Col key={article.id} xs={12} md={6}>
                  <Card
                    className="h-100 shadow-sm"
                    as={Link}
                    to={`/blog/${article.slug}`}
                    style={{ textDecoration: 'none', backgroundColor: bgColor }}
                  >
                    <Row className="g-0 h-100">
                      <Col xs={4}>
                        <div className="h-100" style={{ minHeight: '160px' }}>
                          {article.imageUrl ? (
                            <img src={article.imageUrl} alt={article.title} className="w-100 h-100 object-fit-cover rounded-start" />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center rounded-start" style={{ backgroundColor: lightBg ? '#f8f9fa' : 'rgba(255,255,255,0.2)' }}>
                              <Bot size={40} style={{ opacity: 0.3, color: textColorMuted }} />
                            </div>
                          )}
                        </div>
                      </Col>
                      <Col xs={8}>
                        <Card.Body className="d-flex flex-column h-100">
                          <h5 className="fw-bold mb-2" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: textColor
                          }}>
                            {article.title}
                          </h5>
                          <p className="small mb-2" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: textColorMuted
                          }}>
                            {article.excerpt}
                          </p>
                          <small style={{ color: textColorMuted }} className="mt-auto">
                            {formatRelativeDate(article.publishedAt || article.createdAt)}
                          </small>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      )}

      {/* Features Section */}
      <section>
        <div className="text-center mb-4">
          <h2 className="h2 fw-bold mb-2">Возможности платформы</h2>
          <p className="text-secondary">
            Всё необходимое для обучения робототехнике
          </p>
        </div>

        <Row className="g-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Col key={index} xs={12} sm={6} lg={3}>
                <Card className="h-100 shadow-sm text-center" as={Link} to={feature.link} style={{ textDecoration: 'none' }}>
                  <Card.Body className="py-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)'
                      }}
                    >
                      <Icon size={28} className="text-primary" />
                    </div>
                    <h5 className="fw-semibold text-dark mb-2">{feature.title}</h5>
                    <p className="text-secondary small mb-0">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      {/* Students Section */}
      <section>
        <div className="text-center mb-4">
          <h2 className="h2 fw-bold mb-2">Наши ученики</h2>
          <p className="text-secondary">
            Познакомьтесь с участниками платформы
          </p>
        </div>

        {loading ? (
          <Row className="g-4">
            {[...Array(6)].map((_, i) => (
              <Col key={i} xs={12} md={6} lg={4}>
                <Card className="h-100">
                  <Card.Body style={{ height: '192px' }} className="placeholder-glow">
                    <span className="placeholder w-100 h-100 rounded"></span>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : students.length > 0 ? (
          <>
            <Row className="g-4 mb-4">
              {students.map((student) => (
                <Col key={student.id} xs={12} md={6} lg={4}>
                  <StudentCard student={student} />
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Link to="/rating">
                <Button variant="outline" size="lg">
                  Посмотреть всех учеников →
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <Users size={48} className="text-secondary mb-3 mx-auto d-block" />
            <p className="text-secondary">
              Пока нет зарегистрированных учеников
            </p>
            {!isAuthenticated && (
              <Link to="/login">
                <Button className="mt-3">
                  Зарегистрироваться
                </Button>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section
          className="rounded-3 p-4 p-md-5 text-center text-white"
          style={{ backgroundColor: 'var(--bs-primary)' }}
        >
          <Bot size={48} className="mb-3" />
          <h2 className="h3 fw-bold mb-3">
            Хотите научиться создавать роботов?
          </h2>
          <p className="mb-4" style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.9 }}>
            Присоединяйтесь к нашей школе робототехники и начните своё путешествие в мир технологий
          </p>
          <Link to="/events">
            <Button size="lg" variant="accent">
              Записаться на занятие
            </Button>
          </Link>
        </section>
      )}
    </div>
  );
};
