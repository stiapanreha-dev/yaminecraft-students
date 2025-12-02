import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, Row, Col, Nav, Tab, Modal, Badge } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { UserManager } from '@/components/admin/UserManager';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { EventForm } from '@/components/admin/EventForm';
import { HomeworkForm } from '@/components/admin/HomeworkForm';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { MaterialForm } from '@/components/admin/MaterialForm';
import { Users, Award, Calendar, Plus, Pencil, Trash2, ClipboardList, FolderOpen, BookOpen, FileText, UserCheck, UserX, Eye } from 'lucide-react';
import { usersApi, achievementsApi, eventsApi, homeworkApi, projectsApi, articlesApi, materialsApi } from '@/services/api';
import { toast } from 'react-toastify';
import { formatDateLong } from '@/utils/dateFormatter';

export const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [events, setEvents] = useState([]);
  const [homework, setHomework] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [homeworkDialogOpen, setHomeworkDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingHomework, setEditingHomework] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [viewingHomeworkId, setViewingHomeworkId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const response = await achievementsApi.getAll();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const fetchHomework = useCallback(async () => {
    try {
      const response = await homeworkApi.getAll();
      setHomework(response.data);
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await projectsApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await articlesApi.getAll();
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await materialsApi.getAll();
      setMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  }, []);

  const fetchPendingTeachers = useCallback(async () => {
    try {
      const response = await usersApi.getPendingTeachers();
      setPendingTeachers(response.data);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchUsers();
    fetchAchievements();
    fetchEvents();
    fetchHomework();
    fetchProjects();
    fetchArticles();
    fetchMaterials();
    fetchPendingTeachers();
  }, [authLoading, user?.id, user?.role, fetchUsers, fetchAchievements, fetchEvents, fetchHomework, fetchProjects, fetchArticles, fetchMaterials, fetchPendingTeachers, navigate]);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await usersApi.updateRole(userId, newRole);
      toast.success('Роль пользователя успешно изменена');
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Ошибка изменения роли');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCreateAchievement = async (data) => {
    try {
      setSubmitLoading(true);

      // Преобразуем категорию в uppercase для backend
      const achievementData = {
        ...data,
        category: data.category.toUpperCase(),
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
      };

      if (editingAchievement) {
        await achievementsApi.update(editingAchievement.id, achievementData);
        toast.success('Достижение успешно обновлено');
      } else {
        await achievementsApi.create(achievementData);
        toast.success('Достижение успешно создано');
      }

      setAchievementDialogOpen(false);
      setEditingAchievement(null);
      fetchAchievements();
    } catch (error) {
      console.error('Error with achievement:', error);
      toast.error(editingAchievement ? 'Ошибка обновления достижения' : 'Ошибка создания достижения');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (!confirm('Вы уверены что хотите удалить это достижение?')) return;

    try {
      await achievementsApi.delete(achievementId);
      toast.success('Достижение удалено');
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
      toast.error('Ошибка удаления достижения');
    }
  };

  const handleEditAchievement = (achievement) => {
    const formData = {
      ...achievement,
      category: achievement.category.toLowerCase(),
      date: new Date(achievement.date)
    };
    setEditingAchievement(formData);
    setAchievementDialogOpen(true);
  };

  const handleCreateEvent = async (data) => {
    try {
      setSubmitLoading(true);

      const eventData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
      };

      if (editingEvent) {
        await eventsApi.update(editingEvent.id, eventData);
        toast.success('Мероприятие успешно обновлено');
      } else {
        await eventsApi.create(eventData);
        toast.success('Мероприятие успешно создано');
      }

      setEventDialogOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error('Error with event:', error);
      toast.error(editingEvent ? 'Ошибка обновления мероприятия' : 'Ошибка создания мероприятия');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Вы уверены что хотите удалить это мероприятие?')) return;

    try {
      await eventsApi.delete(eventId);
      toast.success('Мероприятие удалено');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Ошибка удаления мероприятия');
    }
  };

  const handleEditEvent = (event) => {
    const formData = {
      ...event,
      date: new Date(event.date)
    };
    setEditingEvent(formData);
    setEventDialogOpen(true);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      SPORT: 'Спорт',
      STUDY: 'Учёба',
      CREATIVITY: 'Творчество',
      VOLUNTEER: 'Волонтёрство'
    };
    return labels[category] || category;
  };

  const handleApproveTeacher = async (userId) => {
    try {
      await usersApi.approveTeacher(userId);
      toast.success('Педагог подтвержден');
      fetchPendingTeachers();
      fetchUsers();
    } catch (error) {
      console.error('Error approving teacher:', error);
      toast.error('Ошибка подтверждения педагога');
    }
  };

  const handleRejectTeacher = async (userId) => {
    if (!confirm('Вы уверены что хотите отклонить заявку?')) return;
    try {
      await usersApi.rejectTeacher(userId);
      toast.success('Заявка отклонена');
      fetchPendingTeachers();
      fetchUsers();
    } catch (error) {
      console.error('Error rejecting teacher:', error);
      toast.error('Ошибка отклонения заявки');
    }
  };

  // Project handlers
  const handleCreateProject = async (data) => {
    try {
      setSubmitLoading(true);
      if (editingProject) {
        await projectsApi.update(editingProject.id, data);
        toast.success('Проект обновлён');
      } else {
        await projectsApi.create(data);
        toast.success('Проект создан');
      }
      setProjectDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error with project:', error);
      toast.error(editingProject ? 'Ошибка обновления проекта' : 'Ошибка создания проекта');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Удалить проект? Все связанные статьи потеряют привязку.')) return;
    try {
      await projectsApi.delete(projectId);
      toast.success('Проект удалён');
      fetchProjects();
      fetchArticles();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Ошибка удаления проекта');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  // Article handlers
  const handleCreateArticle = async (data) => {
    try {
      setSubmitLoading(true);
      if (editingArticle) {
        await articlesApi.update(editingArticle.id, data);
        toast.success('Статья обновлена');
      } else {
        await articlesApi.create(data);
        toast.success('Статья создана');
      }
      setArticleDialogOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error with article:', error);
      toast.error(editingArticle ? 'Ошибка обновления статьи' : 'Ошибка создания статьи');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!confirm('Удалить статью?')) return;
    try {
      await articlesApi.delete(articleId);
      toast.success('Статья удалена');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Ошибка удаления статьи');
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleDialogOpen(true);
  };

  // Homework handlers
  const handleCreateHomework = async (data) => {
    try {
      setSubmitLoading(true);
      const homeworkData = {
        ...data,
        dueDate: data.dueDate instanceof Date ? data.dueDate.toISOString() : data.dueDate,
      };

      if (editingHomework) {
        await homeworkApi.update(editingHomework.id, homeworkData);
        toast.success('Задание обновлено');
      } else {
        await homeworkApi.create(homeworkData);
        toast.success('Задание создано');
      }

      setHomeworkDialogOpen(false);
      setEditingHomework(null);
      fetchHomework();
    } catch (error) {
      console.error('Error with homework:', error);
      toast.error(editingHomework ? 'Ошибка обновления задания' : 'Ошибка создания задания');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    if (!confirm('Удалить домашнее задание?')) return;
    try {
      await homeworkApi.delete(homeworkId);
      toast.success('Задание удалено');
      fetchHomework();
    } catch (error) {
      console.error('Error deleting homework:', error);
      toast.error('Ошибка удаления задания');
    }
  };

  const handleEditHomework = (hw) => {
    setEditingHomework({
      ...hw,
      dueDate: new Date(hw.dueDate)
    });
    setHomeworkDialogOpen(true);
  };

  const handleViewSubmissions = async (homeworkId) => {
    try {
      const response = await homeworkApi.getSubmissions(homeworkId);
      setSubmissions(response.data);
      setViewingHomeworkId(homeworkId);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Ошибка загрузки работ');
    }
  };

  const handleGradeSubmission = (submission) => {
    setGradingSubmission(submission);
    setGradeModalOpen(true);
  };

  const handleSubmitGrade = async (gradeData) => {
    if (!gradingSubmission || !viewingHomeworkId) return;
    try {
      setSubmitLoading(true);
      await homeworkApi.grade(viewingHomeworkId, gradingSubmission.studentId, gradeData);
      toast.success('Оценка выставлена');
      setGradeModalOpen(false);
      setGradingSubmission(null);
      handleViewSubmissions(viewingHomeworkId);
    } catch (error) {
      console.error('Error grading:', error);
      toast.error('Ошибка выставления оценки');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'Ожидает сдачи',
      SUBMITTED: 'Сдано',
      GRADED: 'Оценено',
      RETURNED: 'Возвращено'
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'secondary',
      SUBMITTED: 'warning',
      GRADED: 'success',
      RETURNED: 'info'
    };
    return variants[status] || 'secondary';
  };

  console.log('AdminPage render:', { authLoading, user, userRole: user?.role });

  if (authLoading) {
    console.log('Showing loading state');
    return <div className="text-center py-5">Загрузка...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    console.log('Not admin, returning null');
    return null;
  }

  console.log('Rendering admin panel content');
  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h1 className="display-6 fw-bold mb-2">Админ-панель</h1>
          <p className="text-secondary">
            Управление пользователями, достижениями и мероприятиями
          </p>
        </div>
      </div>

      {/* Stats */}
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Всего пользователей</small>
                <h3 className="fw-bold mb-0">{users.length}</h3>
              </div>
              <Users style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Учеников</small>
                <h3 className="fw-bold mb-0">
                  {users.filter(u => u.role === 'STUDENT').length}
                </h3>
              </div>
              <Users style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Администраторов</small>
                <h3 className="fw-bold mb-0">
                  {users.filter(u => u.role === 'ADMIN').length}
                </h3>
              </div>
              <Users style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tab.Container defaultActiveKey="users">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="users" className="d-flex align-items-center">
              <Users style={{ width: '16px', height: '16px' }} className="me-2" />
              Пользователи
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="achievements" className="d-flex align-items-center">
              <Award style={{ width: '16px', height: '16px' }} className="me-2" />
              Достижения
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="events" className="d-flex align-items-center">
              <Calendar style={{ width: '16px', height: '16px' }} className="me-2" />
              Мероприятия
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="pending-teachers" className="d-flex align-items-center">
              <UserCheck style={{ width: '16px', height: '16px' }} className="me-2" />
              Заявки педагогов
              {pendingTeachers.length > 0 && (
                <Badge bg="danger" pill className="ms-2">
                  {pendingTeachers.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="projects" className="d-flex align-items-center">
              <FolderOpen style={{ width: '16px', height: '16px' }} className="me-2" />
              Проекты
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="articles" className="d-flex align-items-center">
              <FileText style={{ width: '16px', height: '16px' }} className="me-2" />
              Статьи
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="homework" className="d-flex align-items-center">
              <ClipboardList style={{ width: '16px', height: '16px' }} className="me-2" />
              Домашние задания
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          {/* Users Tab */}
          <Tab.Pane eventKey="users">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Управление пользователями</h5>
              </Card.Header>
              <Card.Body>
                <UserManager
                  users={users}
                  onChangeRole={handleChangeRole}
                  onViewProfile={handleViewProfile}
                />
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Achievements Tab */}
          <Tab.Pane eventKey="achievements">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setAchievementDialogOpen(true)}>
                <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
                Добавить достижение
              </Button>
            </div>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Управление достижениями ({achievements.length})</h5>
              </Card.Header>
              <Card.Body>
                {achievements.length === 0 ? (
                  <p className="text-secondary text-center py-4">
                    Нет созданных достижений
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {achievements.map((achievement) => {
                      const student = users.find(u => u.id === achievement.userId);
                      return (
                        <div key={achievement.id} className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-semibold mb-1">{achievement.title}</h6>
                              <p className="text-secondary small mb-1">{achievement.description}</p>
                              <div className="d-flex flex-wrap gap-2 small text-secondary">
                                <span>Ученик: {student ? `${student.firstName} ${student.lastName}` : 'Не указан'}</span>
                                <span>•</span>
                                <span>Категория: {getCategoryLabel(achievement.category)}</span>
                                <span>•</span>
                                <span>Баллы: {achievement.points}</span>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAchievement(achievement)}
                              >
                                <Pencil style={{ width: '16px', height: '16px' }} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAchievement(achievement.id)}
                              >
                                <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Events Tab */}
          <Tab.Pane eventKey="events">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setEventDialogOpen(true)}>
                <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
                Добавить мероприятие
              </Button>
            </div>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Управление мероприятиями ({events.length})</h5>
              </Card.Header>
              <Card.Body>
                {events.length === 0 ? (
                  <p className="text-secondary text-center py-4">
                    Нет созданных мероприятий
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {events.map((event) => (
                      <div key={event.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-1">{event.title}</h6>
                            <p className="text-secondary small mb-1">{event.description}</p>
                            <div className="d-flex flex-wrap gap-2 small text-secondary">
                              <span>Место: {event.location}</span>
                              <span>•</span>
                              <span>Дата: {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Pencil style={{ width: '16px', height: '16px' }} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Pending Teachers Tab */}
          <Tab.Pane eventKey="pending-teachers">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Заявки на роль педагога ({pendingTeachers.length})</h5>
              </Card.Header>
              <Card.Body>
                {pendingTeachers.length === 0 ? (
                  <p className="text-secondary text-center py-4">
                    Нет ожидающих заявок
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {pendingTeachers.map((teacher) => (
                      <div key={teacher.id} className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-1">
                              {teacher.lastName} {teacher.firstName} {teacher.middleName || ''}
                            </h6>
                            <p className="text-secondary small mb-0">
                              Email: {teacher.email}
                            </p>
                            <p className="text-secondary small mb-0">
                              Дата заявки: {new Date(teacher.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveTeacher(teacher.id)}
                            >
                              <UserCheck style={{ width: '16px', height: '16px' }} className="me-1" />
                              Подтвердить
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectTeacher(teacher.id)}
                            >
                              <UserX style={{ width: '16px', height: '16px' }} className="text-danger" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Projects Tab */}
          <Tab.Pane eventKey="projects">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setProjectDialogOpen(true)}>
                <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
                Добавить проект
              </Button>
            </div>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Управление проектами ({projects.length})</h5>
              </Card.Header>
              <Card.Body>
                {projects.length === 0 ? (
                  <p className="text-secondary text-center py-4">
                    Нет созданных проектов
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {projects.map((project) => {
                      const projectArticles = articles.filter(a => a.projectId === project.id);
                      return (
                        <div key={project.id} className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span
                                  className="rounded-circle"
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: project.color,
                                    display: 'inline-block'
                                  }}
                                />
                                <h6 className="fw-semibold mb-0">{project.name}</h6>
                              </div>
                              {project.description && (
                                <p className="text-secondary small mb-1">{project.description}</p>
                              )}
                              <div className="small text-secondary">
                                Статей: {projectArticles.length}
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                              >
                                <Pencil style={{ width: '16px', height: '16px' }} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Articles Tab */}
          <Tab.Pane eventKey="articles">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setArticleDialogOpen(true)}>
                <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
                Добавить статью
              </Button>
            </div>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Управление статьями ({articles.length})</h5>
              </Card.Header>
              <Card.Body>
                {articles.length === 0 ? (
                  <p className="text-secondary text-center py-4">
                    Нет созданных статей
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {articles.map((article) => {
                      const project = projects.find(p => p.id === article.projectId);
                      return (
                        <div key={article.id} className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-semibold mb-0">{article.title}</h6>
                                <Badge bg={article.published ? 'success' : 'secondary'}>
                                  {article.published ? 'Опубликовано' : 'Черновик'}
                                </Badge>
                              </div>
                              {article.excerpt && (
                                <p className="text-secondary small mb-1">{article.excerpt}</p>
                              )}
                              <div className="d-flex flex-wrap gap-2 small text-secondary">
                                {project && (
                                  <>
                                    <span className="d-flex align-items-center gap-1">
                                      <span
                                        className="rounded-circle"
                                        style={{
                                          width: '10px',
                                          height: '10px',
                                          backgroundColor: project.color,
                                          display: 'inline-block'
                                        }}
                                      />
                                      {project.name}
                                    </span>
                                    <span>•</span>
                                  </>
                                )}
                                <span>Создано: {new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditArticle(article)}
                              >
                                <Pencil style={{ width: '16px', height: '16px' }} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteArticle(article.id)}
                              >
                                <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Homework Tab */}
          <Tab.Pane eventKey="homework">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={() => setHomeworkDialogOpen(true)}>
                <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
                Добавить задание
              </Button>
            </div>

            {viewingHomeworkId ? (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Сданные работы: {homework.find(h => h.id === viewingHomeworkId)?.title}
                  </h5>
                  <Button variant="outline" size="sm" onClick={() => setViewingHomeworkId(null)}>
                    Назад к списку
                  </Button>
                </Card.Header>
                <Card.Body>
                  {submissions.length === 0 ? (
                    <p className="text-secondary text-center py-4">
                      Пока нет сданных работ
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {submissions.map((sub) => (
                        <div key={sub.id} className="border rounded p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <h6 className="fw-semibold mb-0">
                                  {sub.student?.lastName} {sub.student?.firstName}
                                </h6>
                                <Badge bg={getStatusBadge(sub.status)}>
                                  {getStatusLabel(sub.status)}
                                </Badge>
                              </div>
                              <p className="text-secondary mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                                {sub.content}
                              </p>
                              {sub.fileUrl && (
                                <div className="mb-2">
                                  <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="small">
                                    Прикреплённый файл
                                  </a>
                                </div>
                              )}
                              <div className="d-flex flex-wrap gap-2 small text-secondary">
                                <span>Сдано: {new Date(sub.submittedAt).toLocaleString('ru-RU')}</span>
                                {sub.grade !== null && (
                                  <>
                                    <span>•</span>
                                    <span className="fw-semibold">Оценка: {sub.grade}/10</span>
                                  </>
                                )}
                              </div>
                              {sub.comment && (
                                <div className="mt-2 p-2 bg-light rounded small">
                                  <strong>Комментарий:</strong> {sub.comment}
                                </div>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <Button
                                variant={sub.status === 'GRADED' ? 'outline' : 'primary'}
                                size="sm"
                                onClick={() => handleGradeSubmission(sub)}
                              >
                                {sub.status === 'GRADED' ? 'Изменить оценку' : 'Оценить'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Домашние задания ({homework.length})</h5>
                </Card.Header>
                <Card.Body>
                  {homework.length === 0 ? (
                    <p className="text-secondary text-center py-4">
                      Нет созданных заданий
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {homework.map((hw) => {
                        const isOverdue = new Date(hw.dueDate) < new Date();
                        return (
                          <div key={hw.id} className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <h6 className="fw-semibold mb-0">{hw.title}</h6>
                                  {isOverdue && (
                                    <Badge bg="danger">Просрочено</Badge>
                                  )}
                                </div>
                                <p className="text-secondary small mb-1" style={{
                                  maxHeight: '60px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {hw.description}
                                </p>
                                <div className="d-flex flex-wrap gap-2 small text-secondary">
                                  <span>Срок сдачи: {new Date(hw.dueDate).toLocaleString('ru-RU')}</span>
                                  <span>•</span>
                                  <span>Сдано работ: {hw._count?.submissions || 0}</span>
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewSubmissions(hw.id)}
                                  title="Просмотреть работы"
                                >
                                  <Eye style={{ width: '16px', height: '16px' }} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditHomework(hw)}
                                >
                                  <Pencil style={{ width: '16px', height: '16px' }} />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteHomework(hw.id)}
                                >
                                  <Trash2 style={{ width: '16px', height: '16px' }} className="text-danger" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Achievement Modal */}
      <Modal
        show={achievementDialogOpen}
        onHide={() => {
          setAchievementDialogOpen(false);
          setEditingAchievement(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingAchievement ? 'Редактировать достижение' : 'Добавить достижение'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AchievementForm
            students={users}
            initialData={editingAchievement}
            onSubmit={handleCreateAchievement}
            onCancel={() => {
              setAchievementDialogOpen(false);
              setEditingAchievement(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Event Modal */}
      <Modal
        show={eventDialogOpen}
        onHide={() => {
          setEventDialogOpen(false);
          setEditingEvent(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingEvent ? 'Редактировать мероприятие' : 'Добавить мероприятие'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            initialData={editingEvent}
            onSubmit={handleCreateEvent}
            onCancel={() => {
              setEventDialogOpen(false);
              setEditingEvent(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Project Modal */}
      <Modal
        show={projectDialogOpen}
        onHide={() => {
          setProjectDialogOpen(false);
          setEditingProject(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Редактировать проект' : 'Новый проект'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleCreateProject}
            onCancel={() => {
              setProjectDialogOpen(false);
              setEditingProject(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Article Modal */}
      <Modal
        show={articleDialogOpen}
        onHide={() => {
          setArticleDialogOpen(false);
          setEditingArticle(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingArticle ? 'Редактировать статью' : 'Новая статья'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ArticleForm
            initialData={editingArticle}
            onSubmit={handleCreateArticle}
            onCancel={() => {
              setArticleDialogOpen(false);
              setEditingArticle(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Homework Modal */}
      <Modal
        show={homeworkDialogOpen}
        onHide={() => {
          setHomeworkDialogOpen(false);
          setEditingHomework(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingHomework ? 'Редактировать задание' : 'Новое задание'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HomeworkForm
            initialData={editingHomework}
            onSubmit={handleCreateHomework}
            onCancel={() => {
              setHomeworkDialogOpen(false);
              setEditingHomework(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>

      {/* Grade Modal */}
      <Modal
        show={gradeModalOpen}
        onHide={() => {
          setGradeModalOpen(false);
          setGradingSubmission(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Оценка работы: {gradingSubmission?.student?.lastName} {gradingSubmission?.student?.firstName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GradeForm
            initialGrade={gradingSubmission?.grade}
            initialFeedback={gradingSubmission?.comment}
            onSubmit={handleSubmitGrade}
            onCancel={() => {
              setGradeModalOpen(false);
              setGradingSubmission(null);
            }}
            loading={submitLoading}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Inline GradeForm component
const GradeForm = ({ initialGrade, initialFeedback, onSubmit, onCancel, loading }) => {
  const [grade, setGrade] = useState(initialGrade || '');
  const [comment, setComment] = useState(initialFeedback || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grade || grade < 1 || grade > 10) {
      return;
    }
    onSubmit({ grade: parseInt(grade), comment });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Оценка (1-10)</label>
        <input
          type="number"
          className="form-control"
          min="1"
          max="10"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Комментарий (опционально)</label>
        <textarea
          className="form-control"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Напишите комментарий к работе..."
        />
      </div>
      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading || !grade}>
          {loading ? 'Сохранение...' : 'Сохранить оценку'}
        </Button>
      </div>
    </form>
  );
};
