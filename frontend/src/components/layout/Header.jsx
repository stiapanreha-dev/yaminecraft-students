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
    { to: '/blog', label: 'Блог', icon: BookOpen },
    { to: '/rating', label: 'Рейтинг', icon: Trophy },
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
      className="sticky-top bg-white border-bottom shadow-sm"
      style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.95)' }}
    >
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--bs-primary)'
            }}
          >
            <Trophy style={{ width: '20px', height: '20px', color: 'white' }} />
          </div>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="main-navbar" className="border-0">
          {expanded ? (
            <X style={{ width: '24px', height: '24px' }} />
          ) : (
            <Menu style={{ width: '24px', height: '24px' }} />
          )}
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          {/* Desktop Navigation */}
          <Nav className="me-auto">
            {navLinks.map((link) => (
              <Nav.Link
                key={link.to}
                as={Link}
                to={link.to}
                onClick={() => setExpanded(false)}
                className="text-secondary fw-medium"
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
              <Button
                onClick={() => { navigate('/login'); setExpanded(false); }}
                size="sm"
              >
                Войти
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
