import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, Form, Nav, Tab, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { toast } from 'react-toastify';

const ROLE_OPTIONS = [
  { value: 'VISITOR', label: 'Посетитель' },
  { value: 'STUDENT', label: 'Ученик' },
  { value: 'PENDING_TEACHER', label: 'Педагог' },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('VISITOR');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      setLoading(true);
      const result = await signIn(loginEmail, loginPassword);

      if (result.success) {
        toast.success('Вход выполнен успешно');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log('Register attempt:', { registerEmail, registerPassword: !!registerPassword, registerConfirmPassword: !!registerConfirmPassword, firstName, lastName, role, birthDate });

    // Base validation
    if (!registerEmail || !registerPassword || !registerConfirmPassword || !firstName || !lastName) {
      console.log('Validation failed:', { registerEmail: !registerEmail, registerPassword: !registerPassword, registerConfirmPassword: !registerConfirmPassword, firstName: !firstName, lastName: !lastName });
      toast.error('Заполните все обязательные поля');
      return;
    }

    // Student-specific validation
    if (role === 'STUDENT' && !birthDate) {
      toast.error('Для учеников обязательна дата рождения');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (registerPassword.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      setLoading(true);
      const profileData = {
        firstName,
        lastName,
        middleName,
        bio: '',
        photoUrl: '',
        role,
      };

      // Only include birthDate if it's set (required for students)
      if (birthDate) {
        profileData.birthDate = new Date(birthDate).toISOString();
      }

      const result = await signUp(registerEmail, registerPassword, profileData);

      if (result.success) {
        if (role === 'PENDING_TEACHER') {
          toast.success('Заявка отправлена. Ожидайте подтверждения администратором.');
        } else {
          toast.success('Регистрация успешна');
        }
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Ошибка регистрации');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div style={{ width: '100%', maxWidth: '450px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)'
            }}
          >
            <Trophy style={{ width: '32px', height: '32px' }} className="text-primary" />
          </div>
          <h1 className="h3 fw-bold">Анкеты учеников</h1>
          <p className="text-secondary">
            Войдите в систему или зарегистрируйтесь
          </p>
        </div>

        {/* Tabs */}
        <Tab.Container defaultActiveKey="login">
          <Nav variant="pills" className="nav-fill mb-3">
            <Nav.Item>
              <Nav.Link eventKey="login">Вход</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="register">Регистрация</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Login Tab */}
            <Tab.Pane eventKey="login">
              <Card>
                <Card.Header>
                  <h5 className="mb-1">Вход в систему</h5>
                  <small className="text-secondary">Введите ваш email и пароль</small>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="student@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={loading}>
                      {loading && <Spinner animation="border" size="sm" className="me-2" />}
                      Войти
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Register Tab */}
            <Tab.Pane eventKey="register">
              <Card>
                <Card.Header>
                  <h5 className="mb-1">Регистрация</h5>
                  <small className="text-secondary">Создайте новый аккаунт</small>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleRegister}>
                    {/* Role selection */}
                    <Form.Group className="mb-3">
                      <Form.Label>Я регистрируюсь как *</Form.Label>
                      <Form.Select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    {role === 'PENDING_TEACHER' && (
                      <Alert variant="info" className="mb-3">
                        Заявка на роль педагога будет рассмотрена администратором.
                      </Alert>
                    )}

                    <Row className="mb-3">
                      <Col>
                        <Form.Group>
                          <Form.Label>Имя *</Form.Label>
                          <Form.Control
                            placeholder="Иван"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label>Фамилия *</Form.Label>
                          <Form.Control
                            placeholder="Иванов"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={loading}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label>Отчество</Form.Label>
                      <Form.Control
                        placeholder="Иванович"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>

                    {/* Birth date only for students */}
                    {role === 'STUDENT' && (
                      <Form.Group className="mb-3">
                        <Form.Label>Дата рождения *</Form.Label>
                        <Form.Control
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          disabled={loading}
                        />
                      </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="student@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Пароль *</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Подтвердите пароль *</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="••••••••"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={loading}>
                      {loading && <Spinner animation="border" size="sm" className="me-2" />}
                      Зарегистрироваться
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
};
