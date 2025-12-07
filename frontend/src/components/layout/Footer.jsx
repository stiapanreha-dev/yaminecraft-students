import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Github, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'Главная', to: '/' },
      { label: 'О проекте', to: '/about' },
      { label: 'Мероприятия', to: '/events' },
      { label: 'Рейтинг', to: '/rating' },
    ],
    social: [
      { label: 'GitHub', icon: Github, href: '#' },
      { label: 'Email', icon: Mail, href: 'mailto:support@students.local' },
    ],
  };

  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--bs-dark)' }}>
      <Container className="py-5">
        <Row className="g-4">
          {/* About Section */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3 text-white">Анкеты учеников</h5>
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Платформа для отслеживания достижений учеников и рейтинговой системы.
              Мотивируем к развитию и успеху!
            </p>
          </Col>

          {/* Navigation Links */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3 text-white">Навигация</h5>
            <ul className="list-unstyled mb-0">
              {footerLinks.navigation.map((link) => (
                <li key={link.to} className="mb-2">
                  <Link
                    to={link.to}
                    className="text-decoration-none small"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Social Links */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3 text-white">Контакты</h5>
            <div className="d-flex gap-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                    aria-label={link.label}
                  >
                    <Icon style={{ width: '20px', height: '20px' }} />
                  </a>
                );
              })}
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Bar */}
        <Row className="align-items-center">
          <Col xs={12} sm={6} className="text-center text-sm-start mb-2 mb-sm-0">
            <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
              © {currentYear} Анкеты учеников. Все права защищены.
            </p>
          </Col>
          <Col xs={12} sm={6} className="text-center text-sm-end">
            <p className="small mb-0 d-flex align-items-center justify-content-center justify-content-sm-end" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Сделано с <Heart className="mx-1" style={{ width: '16px', height: '16px', color: 'var(--bs-accent)' }} /> для наших учеников
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
