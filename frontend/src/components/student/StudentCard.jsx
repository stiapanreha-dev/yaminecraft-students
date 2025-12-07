import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, User } from 'lucide-react';
import { calculateAge } from '@/utils/dateFormatter';

/**
 * Карточка ученика для списка
 * @param {Object} student - данные ученика
 * @param {boolean} showPoints - показывать баллы
 * @param {number} rank - позиция в рейтинге (опционально)
 * @param {string} variant - вариант отображения: 'default' | 'dark'
 */
export const StudentCard = ({ student, showPoints = false, rank = null, variant = 'default' }) => {
  if (!student) return null;

  const isDark = variant === 'dark';
  const userId = student.id;
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Без имени';
  const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase() || '?';
  const age = student.birthDate ? calculateAge(student.birthDate) : null;

  // Определяем цвет бейджа для ранга
  const getRankBadgeVariant = () => {
    if (!rank) return 'default';
    if (rank === 1) return 'default';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'outline';
    return 'outline';
  };

  const cardStyle = {
    backgroundColor: '#313642',
    border: 'none',
    borderRadius: '1rem'
  };

  const textColor = 'white';
  const mutedColor = 'rgba(255,255,255,0.7)';

  return (
    <Card className={`h-100 ${isDark ? '' : 'shadow-sm hover-shadow'}`} style={cardStyle}>
      <Card.Body className="p-4">
        <div className="d-flex gap-3">
          {/* Avatar */}
          <div className="position-relative flex-shrink-0">
            <Avatar size="lg">
              <AvatarImage src={student.photoUrl} alt={fullName} />
              <AvatarFallback />
            </Avatar>
            {rank && rank <= 3 && (
              <div
                className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'var(--bs-accent)'
                }}
              >
                <Trophy style={{ width: '12px', height: '12px', color: 'var(--bs-dark)' }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-grow-1 min-w-0">
            {/* Name and Rank */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="min-w-0">
                <h5 className="mb-0 fw-semibold text-truncate" style={{ color: textColor }}>{fullName}</h5>
                {student.middleName && (
                  <small style={{ color: mutedColor }}>{student.middleName}</small>
                )}
              </div>
              {rank && (
                <Badge variant={getRankBadgeVariant()} className="ms-2 flex-shrink-0">
                  #{rank}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="d-flex flex-wrap gap-3 small mb-2" style={{ color: mutedColor }}>
              {student.class && (
                <div className="d-flex align-items-center">
                  <User style={{ width: '14px', height: '14px' }} className="me-1" />
                  <span>{student.class} класс</span>
                </div>
              )}
              {age && (
                <div className="d-flex align-items-center">
                  <Calendar style={{ width: '14px', height: '14px' }} className="me-1" />
                  <span>{age} лет</span>
                </div>
              )}
            </div>

            {/* Bio Preview */}
            {student.bio && (
              <p className="small mb-0 text-truncate-2" style={{ color: mutedColor }}>
                {student.bio}
              </p>
            )}
          </div>
        </div>
      </Card.Body>

      <Card.Footer
        className="px-4 py-3 d-flex justify-content-between align-items-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div>
          {showPoints && student.totalPoints !== undefined && (
            <div className="d-flex align-items-center small fw-medium" style={{ color: textColor }}>
              <Trophy style={{ width: '16px', height: '16px', color: 'var(--bs-accent)' }} className="me-1" />
              <span>{student.totalPoints} баллов</span>
            </div>
          )}
        </div>
        <Link to={`/profile/${userId}`}>
          <Button variant="accent" size="sm">
            Посмотреть профиль
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};
