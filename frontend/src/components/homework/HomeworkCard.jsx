import { Card, Badge } from 'react-bootstrap';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { formatDateLong, formatRelativeDate } from '@/utils/dateFormatter';

const statusConfig = {
  PENDING: { label: 'Не сдано', color: 'warning', icon: AlertCircle },
  SUBMITTED: { label: 'На проверке', color: 'info', icon: Clock },
  GRADED: { label: 'Оценено', color: 'success', icon: CheckCircle },
  RETURNED: { label: 'Возвращено', color: 'danger', icon: XCircle },
};

export const HomeworkCard = ({
  homework,
  submission,
  onView,
  onSubmit,
  isStudent = false
}) => {
  if (!homework) return null;

  const { title, description, dueDate, createdAt } = homework;
  const isOverdue = new Date(dueDate) < new Date();
  const submissionStatus = submission?.status;
  const status = statusConfig[submissionStatus] || (isOverdue ? { label: 'Просрочено', color: 'danger', icon: XCircle } : null);
  const StatusIcon = status?.icon;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        {/* Header with status */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h5 className="fw-bold mb-0">{title}</h5>
          </div>
          {status && (
            <Badge bg={status.color} className="d-flex align-items-center gap-1">
              {StatusIcon && <StatusIcon size={12} />}
              {status.label}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-secondary small mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description}
        </p>

        {/* Due date */}
        <div className="d-flex flex-column gap-2 mb-3 mt-auto">
          <div className="d-flex align-items-center small">
            <Calendar size={16} className="me-2 flex-shrink-0 text-primary" />
            <span className={isOverdue && !submission ? 'text-danger fw-medium' : ''}>
              Срок сдачи: {formatDateLong(dueDate)}
            </span>
          </div>
          {submission?.grade !== null && submission?.grade !== undefined && (
            <div className="d-flex align-items-center small text-success fw-medium">
              <CheckCircle size={16} className="me-2 flex-shrink-0" />
              Оценка: {submission.grade}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <Button variant="outline" className="flex-grow-1" onClick={() => onView?.(homework)}>
            Подробнее
          </Button>
          {isStudent && !submission && !isOverdue && (
            <Button variant="accent" onClick={() => onSubmit?.(homework)}>
              Сдать
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
