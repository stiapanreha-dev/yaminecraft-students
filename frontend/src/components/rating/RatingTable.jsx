import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';

/**
 * Таблица рейтинга учеников
 * @param {Array} ratings - массив рейтинговых данных
 * @param {boolean} loading - состояние загрузки
 * @param {Object} students - объект с данными учеников по userId
 */
export const RatingTable = ({ ratings = [], loading = false, students = {} }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy style={{ width: '20px', height: '20px', color: '#ffc107' }} />;
      case 2:
        return <Medal style={{ width: '20px', height: '20px', color: '#6c757d' }} />;
      case 3:
        return <Award style={{ width: '20px', height: '20px', color: '#fd7e14' }} />;
      default:
        return null;
    }
  };

  const getRankBadgeVariant = (rank) => {
    if (rank === 1) return 'default';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'outline';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="d-flex flex-column gap-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} style={{ height: '64px', width: '100%' }} />
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-5">
        <Trophy style={{ width: '48px', height: '48px' }} className="text-secondary mb-3 mx-auto d-block" />
        <p className="h5 text-secondary mb-2">
          Пока нет данных рейтинга
        </p>
        <p className="text-secondary small">
          Добавьте достижения ученикам, чтобы увидеть рейтинг
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded">
      <Table hover responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th style={{ width: '60px' }} className="text-center">Место</th>
            <th>Ученик</th>
            <th className="d-none d-md-table-cell">Класс</th>
            <th className="text-end">Баллы</th>
            <th className="d-none d-lg-table-cell text-center">Спорт</th>
            <th className="d-none d-lg-table-cell text-center">Учёба</th>
            <th className="d-none d-lg-table-cell text-center">Творчество</th>
            <th className="d-none d-lg-table-cell text-center">Волонтёрство</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => {
            const rank = index + 1;
            const student = students[rating.userId];

            if (!student) return null;

            const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
            const initials = `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase();

            return (
              <tr key={rating.userId}>
                <td className="align-middle">
                  <div className="d-flex align-items-center justify-content-center">
                    {getRankIcon(rank) || (
                      <Badge variant={getRankBadgeVariant(rank)}>
                        {rank}
                      </Badge>
                    )}
                  </div>
                </td>

                <td className="align-middle">
                  <Link
                    to={`/profile/${rating.userId}`}
                    className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                  >
                    <Avatar>
                      <AvatarImage src={student.photoUrl} alt={fullName} />
                      <AvatarFallback />
                    </Avatar>
                    <div>
                      <div className="fw-medium">{fullName}</div>
                      <div className="small text-secondary d-md-none">
                        {student.class} класс
                      </div>
                    </div>
                  </Link>
                </td>

                <td className="align-middle d-none d-md-table-cell">
                  <Badge variant="outline">{student.class}</Badge>
                </td>

                <td className="align-middle text-end fw-semibold">
                  {rating.totalPoints || rating.monthPoints || rating.yearPoints || 0}
                </td>

                <td className="align-middle d-none d-lg-table-cell text-center text-secondary small">
                  {rating.breakdown?.sport || 0}
                </td>

                <td className="align-middle d-none d-lg-table-cell text-center text-secondary small">
                  {rating.breakdown?.study || 0}
                </td>

                <td className="align-middle d-none d-lg-table-cell text-center text-secondary small">
                  {rating.breakdown?.creativity || 0}
                </td>

                <td className="align-middle d-none d-lg-table-cell text-center text-secondary small">
                  {rating.breakdown?.volunteer || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
