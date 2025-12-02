import { useState } from 'react';
import { Card, Row, Col, Nav, Tab, Modal, Form } from 'react-bootstrap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Trophy,
  Calendar,
  User,
  Award,
  Target,
  TrendingUp,
  Pencil
} from 'lucide-react';
import { formatDateLong, calculateAge } from '@/utils/dateFormatter';
import { useUserRating } from '@/hooks/useRating';
import { RATING_PERIODS } from '@/hooks/useRating';
import { useAuth } from '@/hooks/useAuth';
import { usersApi } from '@/services/api';
import { toast } from 'react-toastify';

/**
 * Детальный профиль ученика
 * @param {Object} student - данные ученика
 * @param {Array} achievements - список достижений
 * @param {Function} onUpdate - колбэк после обновления профиля
 */
export const StudentProfile = ({ student, achievements = [], onUpdate }) => {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    photoUrl: ''
  });

  if (!student) return null;

  const userId = student.id;
  const { rating, getPointsByPeriod, getPointsByCategory } = useUserRating(userId);

  // Проверка, может ли текущий пользователь редактировать профиль
  const canEdit = user && (user.id === student.id || user.role === 'ADMIN');

  const openEditModal = () => {
    setEditForm({
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      middleName: student.middleName || '',
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : '',
      photoUrl: student.photoUrl || ''
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      await usersApi.update(student.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        middleName: editForm.middleName || null,
        birthDate: editForm.birthDate ? new Date(editForm.birthDate).toISOString() : null,
        photoUrl: editForm.photoUrl || null
      });
      toast.success('Профиль обновлён');
      setEditModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка обновления профиля');
    } finally {
      setEditLoading(false);
    }
  };

  const fullName = `${student.firstName || ''} ${student.lastName || ''} ${student.middleName || ''}`.trim();
  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || '?';
  const age = student.birthDate ? calculateAge(student.birthDate) : null;

  const categories = [
    { key: 'sport', label: 'Спорт', icon: Trophy, color: 'text-primary' },
    { key: 'study', label: 'Учёба', icon: Target, color: 'text-success' },
    { key: 'creativity', label: 'Творчество', icon: Award, color: 'text-info' },
    { key: 'volunteer', label: 'Волонтёрство', icon: TrendingUp, color: 'text-warning' },
  ];

  const normalizeCategory = (category) => {
    if (!category) return '';
    return category.toLowerCase();
  };

  // Показывать статистику только для учеников
  const isStudent = student.role === 'STUDENT';

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header Card */}
      <Card>
        <Card.Body className="pt-4">
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
            {/* Avatar */}
            <Avatar size="xl">
              <AvatarImage src={student.photoUrl} alt={fullName} />
              <AvatarFallback />
            </Avatar>

            {/* Info */}
            <div className="flex-grow-1 text-center text-md-start">
              <div className="mb-3 d-flex flex-column flex-md-row align-items-center align-items-md-start gap-2">
                <div>
                  <h1 className="h2 fw-bold mb-1">{fullName}</h1>
                  <p className="text-secondary mb-0">{student.email}</p>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openEditModal}
                    className="ms-md-auto"
                  >
                    <Pencil style={{ width: '16px', height: '16px' }} className="me-1" />
                    Редактировать
                  </Button>
                )}
              </div>

              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-3">
                {student.class && (
                  <div className="d-flex align-items-center small">
                    <User style={{ width: '16px', height: '16px' }} className="me-2" />
                    <span>{student.class} класс</span>
                  </div>
                )}
                {age && (
                  <div className="d-flex align-items-center small">
                    <Calendar style={{ width: '16px', height: '16px' }} className="me-2" />
                    <span>{age} лет</span>
                  </div>
                )}
                {student.birthDate && (
                  <div className="d-flex align-items-center small text-secondary">
                    <span>Дата рождения: {formatDateLong(student.birthDate)}</span>
                  </div>
                )}
              </div>

              {student.bio && (
                <p className="text-secondary small mb-0" style={{ maxWidth: '600px' }}>
                  {student.bio}
                </p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Stats Cards - only for students */}
      {isStudent && (
        <Row className="g-3">
          <Col xs={12} md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-secondary fw-medium">Всего баллов</small>
                  <Trophy style={{ width: '16px', height: '16px', color: '#ffc107' }} />
                </div>
                <h3 className="fw-bold mb-1">{getPointsByPeriod(RATING_PERIODS.ALL_TIME)}</h3>
                <small className="text-secondary">За всё время</small>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-secondary fw-medium">За год</small>
                  <Calendar style={{ width: '16px', height: '16px' }} className="text-primary" />
                </div>
                <h3 className="fw-bold mb-1">{getPointsByPeriod(RATING_PERIODS.YEAR)}</h3>
                <small className="text-secondary">Текущий год</small>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-secondary fw-medium">За месяц</small>
                  <TrendingUp style={{ width: '16px', height: '16px' }} className="text-success" />
                </div>
                <h3 className="fw-bold mb-1">{getPointsByPeriod(RATING_PERIODS.MONTH)}</h3>
                <small className="text-secondary">Текущий месяц</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Categories Breakdown - only for students */}
      {isStudent && (
        <Card>
          <Card.Header>
            <h5 className="mb-0">Распределение по категориям</h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const points = getPointsByCategory(category.key);
                return (
                  <Col xs={6} md={3} key={category.key}>
                    <div className="d-flex flex-column align-items-center p-3 border rounded">
                      <Icon className={`${category.color} mb-2`} style={{ width: '32px', height: '32px' }} />
                      <small className="fw-medium text-center">{category.label}</small>
                      <h4 className="fw-bold mb-0">{points}</h4>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Achievements - only for students */}
      {isStudent && <Card>
        <Card.Header>
          <h5 className="mb-0">Достижения ({achievements.length})</h5>
        </Card.Header>
        <Card.Body>
          {achievements.length > 0 ? (
            <Tab.Container defaultActiveKey="all">
              <Nav variant="tabs" className="mb-3 flex-nowrap overflow-auto">
                <Nav.Item>
                  <Nav.Link eventKey="all">Все</Nav.Link>
                </Nav.Item>
                {categories.map((category) => (
                  <Nav.Item key={category.key}>
                    <Nav.Link eventKey={category.key}>{category.label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="all">
                  <div className="d-flex flex-column gap-3">
                    {achievements.map((achievement, index) => (
                      <div key={achievement.id}>
                        <div className="d-flex gap-3">
                          <Badge variant="outline" className="mt-1 flex-shrink-0">
                            +{achievement.points}
                          </Badge>
                          <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-1">{achievement.title}</h6>
                            <p className="text-secondary small mb-1">
                              {achievement.description}
                            </p>
                            <small className="text-secondary">
                              {formatDateLong(achievement.date)}
                            </small>
                          </div>
                        </div>
                        {index < achievements.length - 1 && <hr className="my-3" />}
                      </div>
                    ))}
                  </div>
                </Tab.Pane>

                {categories.map((category) => {
                  const filteredAchievements = achievements.filter(
                    (a) => normalizeCategory(a.category) === category.key
                  );
                  return (
                    <Tab.Pane key={category.key} eventKey={category.key}>
                      {filteredAchievements.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {filteredAchievements.map((achievement, index) => (
                            <div key={achievement.id}>
                              <div className="d-flex gap-3">
                                <Badge variant="outline" className="mt-1 flex-shrink-0">
                                  +{achievement.points}
                                </Badge>
                                <div className="flex-grow-1">
                                  <h6 className="fw-semibold mb-1">{achievement.title}</h6>
                                  <p className="text-secondary small mb-1">
                                    {achievement.description}
                                  </p>
                                  <small className="text-secondary">
                                    {formatDateLong(achievement.date)}
                                  </small>
                                </div>
                              </div>
                              {index < filteredAchievements.length - 1 && <hr className="my-3" />}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-secondary py-4">
                          Нет достижений в этой категории
                        </p>
                      )}
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Tab.Container>
          ) : (
            <p className="text-center text-secondary py-4">
              Пока нет достижений
            </p>
          )}
        </Card.Body>
      </Card>}

      {/* Edit Profile Modal */}
      <Modal
        show={editModalOpen}
        onHide={() => setEditModalOpen(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Редактировать профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Фамилия</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Имя</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Отчество</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.middleName}
                    onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })}
                    placeholder="Необязательно"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Дата рождения</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Фото профиля</Form.Label>
              <ImageUpload
                value={editForm.photoUrl}
                onChange={(url) => setEditForm({ ...editForm, photoUrl: url })}
                onRemove={() => setEditForm({ ...editForm, photoUrl: '' })}
                disabled={editLoading}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
