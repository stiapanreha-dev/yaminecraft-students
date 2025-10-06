import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
 */
export const StudentCard = ({ student, showPoints = false, rank = null }) => {
  if (!student) return null;

  const { profile, id, uid } = student;
  const userId = uid || id;
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();
  const age = profile.birthDate ? calculateAge(profile.birthDate) : null;

  // Определяем цвет бейджа для ранга
  const getRankBadgeVariant = () => {
    if (!rank) return 'default';
    if (rank === 1) return 'default'; // Золото
    if (rank === 2) return 'secondary'; // Серебро
    if (rank === 3) return 'outline'; // Бронза
    return 'outline';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.photoUrl} alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            {rank && rank <= 3 && (
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Trophy className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            {/* Name and Rank */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg leading-tight">
                  {fullName}
                </h3>
                {profile.middleName && (
                  <p className="text-sm text-muted-foreground">
                    {profile.middleName}
                  </p>
                )}
              </div>
              {rank && (
                <Badge variant={getRankBadgeVariant()}>
                  #{rank}
                </Badge>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {profile.class && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{profile.class} класс</span>
                </div>
              )}
              {age && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{age} лет</span>
                </div>
              )}
            </div>

            {/* Bio Preview */}
            {profile.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-between items-center">
        <div>
          {showPoints && student.totalPoints !== undefined && (
            <div className="flex items-center text-sm font-medium">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{student.totalPoints} баллов</span>
            </div>
          )}
        </div>
        <Link to={`/profile/${userId}`}>
          <Button variant="outline" size="sm">
            Посмотреть профиль
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
