import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, Row, Col, Modal, Badge } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { HomeworkForm } from '@/components/admin/HomeworkForm';
import { Plus, Pencil, Trash2, Eye, ClipboardList } from 'lucide-react';
import { homeworkApi } from '@/services/api';
import { toast } from 'react-toastify';

export const TeacherHomeworkPage = () => {
  const { user } = useAuth();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [homeworkDialogOpen, setHomeworkDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingHomework, setEditingHomework] = useState(null);
  const [viewingHomeworkId, setViewingHomeworkId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState(null);

  const fetchHomework = useCallback(async () => {
    try {
      setLoading(true);
      const response = await homeworkApi.getAll();
      setHomework(response.data);
    } catch (error) {
      console.error('Error fetching homework:', error);
      toast.error('Ошибка загрузки заданий');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

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

  if (loading) {
    return <div className="text-center py-5">Загрузка...</div>;
  }

  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h1 className="display-6 fw-bold mb-2">Домашние задания</h1>
          <p className="text-secondary">
            Создание, редактирование и проверка домашних заданий
          </p>
        </div>
        <Button onClick={() => setHomeworkDialogOpen(true)}>
          <Plus style={{ width: '16px', height: '16px' }} className="me-2" />
          Добавить задание
        </Button>
      </div>

      {/* Stats */}
      <Row className="g-3">
        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Всего заданий</small>
                <h3 className="fw-bold mb-0">{homework.length}</h3>
              </div>
              <ClipboardList style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Активных</small>
                <h3 className="fw-bold mb-0">
                  {homework.filter(h => new Date(h.dueDate) >= new Date()).length}
                </h3>
              </div>
              <ClipboardList style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-secondary">Сдано работ</small>
                <h3 className="fw-bold mb-0">
                  {homework.reduce((acc, h) => acc + (h._count?.submissions || 0), 0)}
                </h3>
              </div>
              <ClipboardList style={{ width: '24px', height: '24px' }} className="text-secondary" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content */}
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
                            <span>•</span>
                            <span>
                              {hw._count?.assignments > 0
                                ? `Назначено: ${hw._count.assignments} уч.`
                                : 'Для всех учеников'}
                            </span>
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
