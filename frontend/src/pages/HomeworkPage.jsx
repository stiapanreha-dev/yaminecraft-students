import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Modal, Form, Spinner, Nav, Badge } from 'react-bootstrap';
import { HomeworkCard } from '@/components/homework/HomeworkCard';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Clock, CheckCircle, Upload, MessageSquare, User, AlertCircle, Paperclip, Download } from 'lucide-react';
import { formatDateLong, formatDateTime, formatRelativeDate } from '@/utils/dateFormatter';
import { useAuth } from '@/hooks/useAuth';
import { homeworkApi } from '@/services/api';
import { toast } from 'react-toastify';

const statusConfig = {
  PENDING: { label: 'Не сдано', color: 'warning', icon: AlertCircle },
  SUBMITTED: { label: 'На проверке', color: 'info', icon: Clock },
  GRADED: { label: 'Оценено', color: 'success', icon: CheckCircle },
  RETURNED: { label: 'Возвращено', color: 'danger', icon: AlertCircle },
};

export const HomeworkPage = () => {
  const [homeworkList, setHomeworkList] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitContent, setSubmitContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const { user, isAuthenticated } = useAuth();
  const isStudent = user?.role === 'STUDENT';

  useEffect(() => {
    fetchHomework();
  }, [isAuthenticated]);

  const fetchHomework = async () => {
    try {
      setLoading(true);
      if (isStudent) {
        const response = await homeworkApi.getMy();
        const data = response.data;
        setHomeworkList(data.map(item => item.homework || item));
        setMySubmissions(data.map(item => ({
          homeworkId: item.homework?.id || item.id,
          ...item.submission
        })).filter(s => s.status));
      } else {
        const response = await homeworkApi.getAll();
        setHomeworkList(response.data);
      }
    } catch (error) {
      console.error('Error fetching homework:', error);
      toast.error('Ошибка загрузки заданий');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (homework) => {
    setSelectedHomework(homework);
  };

  const handleOpenSubmit = (homework) => {
    setSelectedHomework(homework);
    setSubmitContent('');
    setShowSubmitModal(true);
  };

  const handleSubmit = async () => {
    if (!submitContent.trim()) {
      toast.warning('Введите ответ');
      return;
    }

    try {
      setSubmitting(true);
      await homeworkApi.submit(selectedHomework.id, { content: submitContent });
      toast.success('Задание успешно сдано!');
      setShowSubmitModal(false);
      setSelectedHomework(null);
      await fetchHomework();
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error(error.response?.data?.message || 'Ошибка сдачи задания');
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmission = (homeworkId) => {
    return mySubmissions.find(s => s.homeworkId === homeworkId);
  };

  const { activeHomework, completedHomework } = useMemo(() => {
    const now = new Date();
    const active = homeworkList.filter(hw => {
      const submission = getSubmission(hw.id);
      return new Date(hw.dueDate) >= now || (!submission && new Date(hw.dueDate) < now);
    });
    const completed = homeworkList.filter(hw => {
      const submission = getSubmission(hw.id);
      return submission?.status === 'GRADED';
    });

    return { activeHomework: active, completedHomework: completed };
  }, [homeworkList, mySubmissions]);

  const displayedHomework = activeTab === 'active' ? activeHomework : completedHomework;
  const selectedSubmission = selectedHomework ? getSubmission(selectedHomework.id) : null;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 py-4">
      {/* Header */}
      <div>
        <h1 className="display-6 fw-bold mb-2">Домашние задания</h1>
        <p className="text-secondary">
          {isStudent ? 'Ваши задания и сроки сдачи' : 'Управление домашними заданиями'}
        </p>
      </div>

      {/* Tabs */}
      {isStudent && (
        <Nav variant="pills" className="gap-2">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'active'}
              onClick={() => setActiveTab('active')}
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <FileText size={18} />
              Активные
              {activeHomework.length > 0 && (
                <Badge bg="light" text="dark" pill>
                  {activeHomework.length}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
              className="d-flex align-items-center gap-2"
              style={{ cursor: 'pointer' }}
            >
              <CheckCircle size={18} />
              Завершенные
            </Nav.Link>
          </Nav.Item>
        </Nav>
      )}

      {/* Homework List */}
      {displayedHomework.length === 0 ? (
        <div className="text-center py-5">
          <FileText size={48} className="text-secondary mb-3 mx-auto d-block" style={{ opacity: 0.5 }} />
          <p className="h5 text-secondary mb-2">
            {activeTab === 'active' ? 'Нет активных заданий' : 'Нет завершенных заданий'}
          </p>
          <p className="text-secondary small">
            {activeTab === 'active' ? 'Все задания выполнены!' : 'Завершенные задания появятся здесь'}
          </p>
        </div>
      ) : (
        <Row className="g-4">
          {displayedHomework.map((homework) => (
            <Col key={homework.id} xs={12} sm={6} lg={4}>
              <HomeworkCard
                homework={homework}
                submission={getSubmission(homework.id)}
                onView={handleViewDetails}
                onSubmit={handleOpenSubmit}
                isStudent={isStudent}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Details Modal */}
      <Modal show={!!selectedHomework && !showSubmitModal} onHide={() => setSelectedHomework(null)} size="lg" centered>
        {selectedHomework && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="d-flex align-items-center gap-2">
                <FileText size={24} className="text-primary" />
                {selectedHomework.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Info */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                    <Calendar size={24} className="text-primary flex-shrink-0" />
                    <div>
                      <div className="small text-muted">Срок сдачи</div>
                      <div className="fw-medium">{formatDateLong(selectedHomework.dueDate)}</div>
                    </div>
                  </div>
                </div>
                {selectedSubmission && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-3 p-3 rounded bg-light">
                      {(() => {
                        const status = statusConfig[selectedSubmission.status];
                        const StatusIcon = status?.icon;
                        return (
                          <>
                            <StatusIcon size={24} className={`text-${status?.color} flex-shrink-0`} />
                            <div>
                              <div className="small text-muted">Статус</div>
                              <div className="fw-medium">{status?.label}</div>
                              {selectedSubmission.grade !== null && selectedSubmission.grade !== undefined && (
                                <div className="text-success">Оценка: {selectedSubmission.grade}</div>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Описание задания</h6>
                <p className="text-secondary mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedHomework.description}
                </p>
              </div>

              {/* Attached files */}
              {selectedHomework.files && selectedHomework.files.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2 d-flex align-items-center gap-2">
                    <Paperclip size={18} className="text-primary" />
                    Прикреплённые материалы
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {selectedHomework.files.map((file, index) => (
                      <a
                        key={index}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center gap-2 p-2 border rounded text-decoration-none text-dark hover-bg-light"
                        style={{ transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FileText size={20} className="text-secondary flex-shrink-0" />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="text-truncate fw-medium" style={{ fontSize: '0.9rem' }}>
                            {file.filename}
                          </div>
                          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                            {file.fileSize < 1024
                              ? file.fileSize + ' B'
                              : file.fileSize < 1024 * 1024
                                ? (file.fileSize / 1024).toFixed(1) + ' KB'
                                : (file.fileSize / (1024 * 1024)).toFixed(1) + ' MB'}
                          </div>
                        </div>
                        <Download size={18} className="text-primary flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* My submission */}
              {selectedSubmission && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2">Ваш ответ</h6>
                  <div className="p-3 bg-light rounded">
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedSubmission.content}
                    </p>
                    <div className="small text-muted mt-2">
                      Сдано: {formatDateTime(selectedSubmission.submittedAt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher comment */}
              {selectedSubmission?.comment && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-2 d-flex align-items-center gap-2">
                    <MessageSquare size={18} className="text-primary" />
                    Комментарий преподавателя
                  </h6>
                  <div className="p-3 bg-primary bg-opacity-10 rounded">
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedSubmission.comment}
                    </p>
                  </div>
                </div>
              )}

              {/* Submit button */}
              {isStudent && !selectedSubmission && new Date(selectedHomework.dueDate) >= new Date() && (
                <Button
                  variant="accent"
                  className="w-100"
                  onClick={() => {
                    setShowSubmitModal(true);
                  }}
                >
                  <Upload size={18} className="me-2" />
                  Сдать задание
                </Button>
              )}
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Submit Modal */}
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)} size="lg" centered>
        {selectedHomework && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Сдача задания: {selectedHomework.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Ваш ответ</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  placeholder="Введите ваш ответ или ссылку на выполненную работу..."
                  value={submitContent}
                  onChange={(e) => setSubmitContent(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Вы можете прикрепить ссылку на Google Docs, GitHub или другой ресурс
                </Form.Text>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
                Отмена
              </Button>
              <Button variant="accent" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Отправка...' : 'Отправить'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};
