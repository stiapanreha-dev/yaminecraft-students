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
    <footer className="border-top bg-light mt-auto">
      <Container className="py-4">
        <Row className="g-4">
          {/* About Section */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3">Анкеты учеников</h5>
            <p className="text-secondary small mb-0">
              Платформа для отслеживания достижений учеников и рейтинговой системы.
              Мотивируем к развитию и успеху!
            </p>
          </Col>

          {/* Navigation Links */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3">Навигация</h5>
            <ul className="list-unstyled mb-0">
              {footerLinks.navigation.map((link) => (
                <li key={link.to} className="mb-2">
                  <Link
                    to={link.to}
                    className="text-secondary text-decoration-none small hover-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* Social Links */}
          <Col xs={12} md={4}>
            <h5 className="fw-semibold mb-3">Контакты</h5>
            <div className="d-flex gap-3">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary"
                    aria-label={link.label}
                  >
                    <Icon style={{ width: '20px', height: '20px' }} />
                  </a>
                );
              })}
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Bottom Bar */}
        <Row className="align-items-center">
          <Col xs={12} sm={6} className="text-center text-sm-start mb-2 mb-sm-0">
            <p className="text-secondary small mb-0">
              © {currentYear} Анкеты учеников. Все права защищены.
            </p>
          </Col>
          <Col xs={12} sm={6} className="text-center text-sm-end">
            <p className="text-secondary small mb-0 d-flex align-items-center justify-content-center justify-content-sm-end">
              Сделано с <Heart className="mx-1 text-danger" style={{ width: '16px', height: '16px' }} /> для наших учеников
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
