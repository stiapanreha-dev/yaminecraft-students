import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Badge } from 'react-bootstrap';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  X,
  Home,
  Info,
  Calendar,
  Trophy,
  User,
  LogOut,
  Shield,
  BookOpen,
  FileText,
  ClipboardList
} from 'lucide-react';

export const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const { user, isAuthenticated, isAdmin, isTeacherOrAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const allNavLinks = [
    { to: '/', label: 'Главная', icon: Home },
    { to: '/events', label: 'Мероприятия', icon: Calendar },
    { to: '/blog', label: 'Наши проекты', icon: BookOpen },
    { to: '/rating', label: 'Областной рейтинг', icon: Trophy },
    { to: '/about', label: 'О нас', icon: Info },
    { to: '/materials', label: 'Педагогам', icon: FileText, teacherOnly: true },
  ];

  // Фильтруем ссылки: teacherOnly показываем только для TEACHER и ADMIN
  const navLinks = allNavLinks.filter(link => {
    if (link.teacherOnly) {
      return isTeacherOrAdmin();
    }
    return true;
  });

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  return (
    <Navbar
      expand="md"
      expanded={expanded}
      onToggle={setExpanded}
      className="sticky-top"
      style={{ backgroundColor: 'var(--bs-primary)' }}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255,255,255,0.2)'
            }}
          >
            <Trophy style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="main-navbar" className="border-0" style={{ color: 'white' }}>
          {expanded ? (
            <X style={{ width: '24px', height: '24px', color: 'white' }} />
          ) : (
            <Menu style={{ width: '24px', height: '24px', color: 'white' }} />
          )}
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          {/* Desktop Navigation */}
          <Nav className="me-auto gap-2 flex-nowrap">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.to}
                as={Link}
                to={link.to}
                onClick={() => setExpanded(false)}
                className="nav-link-accent fw-medium px-2 py-2 text-nowrap btn"
                style={{
                  backgroundColor: 'var(--bs-accent)',
                  color: 'var(--bs-dark)',
                  transition: 'all 0.2s ease',
                  fontSize: '0.875rem'
                }}
              >
                <span className="d-md-none me-2">
                  <link.icon style={{ width: '16px', height: '16px' }} />
                </span>
                {link.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* User Menu */}
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  className="position-relative cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar>
                    <AvatarImage src={user?.photoUrl} alt={user?.firstName} />
                    <AvatarFallback />
                  </Avatar>
                  {isAdmin() && (
                    <Badge
                      bg="danger"
                      className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        top: '-4px',
                        right: '-4px',
                        width: '20px',
                        height: '20px',
                        padding: 0
                      }}
                    >
                      <Shield style={{ width: '12px', height: '12px' }} />
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow">
                  <div className="px-3 py-2">
                    <p className="mb-0 fw-medium small">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="mb-0 text-secondary" style={{ fontSize: '0.75rem' }}>
                      {user?.email}
                    </p>
                  </div>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { navigate('/dashboard'); setExpanded(false); }}>
                    <User className="me-2" style={{ width: '16px', height: '16px' }} />
                    Личный кабинет
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => { navigate('/homework'); setExpanded(false); }}>
                    <ClipboardList className="me-2" style={{ width: '16px', height: '16px' }} />
                    Домашние задания
                  </Dropdown.Item>
                  {isTeacherOrAdmin() && (
                    <Dropdown.Item onClick={() => { navigate('/homework/manage'); setExpanded(false); }}>
                      <ClipboardList className="me-2" style={{ width: '16px', height: '16px' }} />
                      Управление ДЗ
                    </Dropdown.Item>
                  )}
                  {isAdmin() && (
                    <Dropdown.Item onClick={() => { navigate('/admin'); setExpanded(false); }}>
                      <Shield className="me-2" style={{ width: '16px', height: '16px' }} />
                      Админ-панель
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignOut} className="text-danger">
                    <LogOut className="me-2" style={{ width: '16px', height: '16px' }} />
                    Выйти
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav className="gap-2 flex-column flex-md-row w-100 w-md-auto mt-3 mt-md-0">
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={() => setExpanded(false)}
                  className="nav-link-accent fw-medium px-3 py-2 btn"
                  style={{
                    backgroundColor: 'var(--bs-accent)',
                    color: 'var(--bs-dark)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span className="d-md-none me-2">
                    <LogOut style={{ width: '16px', height: '16px', transform: 'rotate(180deg)' }} />
                  </span>
                  Войти
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login?tab=register"
                  onClick={() => setExpanded(false)}
                  className="nav-link-accent fw-medium px-3 py-2 btn"
                  style={{
                    backgroundColor: 'var(--bs-accent)',
                    color: 'var(--bs-dark)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span className="d-md-none me-2">
                    <User style={{ width: '16px', height: '16px' }} />
                  </span>
                  Регистрация
                </Nav.Link>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
