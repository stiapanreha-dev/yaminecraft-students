import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />;
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
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Пока нет данных рейтинга
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Добавьте достижения ученикам, чтобы увидеть рейтинг
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Место</TableHead>
            <TableHead>Ученик</TableHead>
            <TableHead className="hidden md:table-cell">Класс</TableHead>
            <TableHead className="text-right">Баллы</TableHead>
            <TableHead className="hidden lg:table-cell text-center">Спорт</TableHead>
            <TableHead className="hidden lg:table-cell text-center">Учёба</TableHead>
            <TableHead className="hidden lg:table-cell text-center">Творчество</TableHead>
            <TableHead className="hidden lg:table-cell text-center">Волонтёрство</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((rating, index) => {
            const rank = index + 1;
            const student = students[rating.userId];

            if (!student) return null;

            const fullName = `${student.profile.firstName} ${student.profile.lastName}`;
            const initials = `${student.profile.firstName?.[0] || ''}${student.profile.lastName?.[0] || ''}`.toUpperCase();

            return (
              <TableRow key={rating.userId} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getRankIcon(rank) || (
                      <Badge variant={getRankBadgeVariant(rank)}>
                        {rank}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Link
                    to={`/profile/${rating.userId}`}
                    className="flex items-center space-x-3 hover:underline"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.profile.photoUrl} alt={fullName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{fullName}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {student.profile.class} класс
                      </div>
                    </div>
                  </Link>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{student.profile.class}</Badge>
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {rating.totalPoints || rating.monthPoints || rating.yearPoints || 0}
                </TableCell>

                <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                  {rating.breakdown?.sport || 0}
                </TableCell>

                <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                  {rating.breakdown?.study || 0}
                </TableCell>

                <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                  {rating.breakdown?.creativity || 0}
                </TableCell>

                <TableCell className="hidden lg:table-cell text-center text-sm text-muted-foreground">
                  {rating.breakdown?.volunteer || 0}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
