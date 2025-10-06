import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDateLong, formatTime } from '@/utils/dateFormatter';

/**
 * Карточка мероприятия
 * @param {Object} event - данные мероприятия
 * @param {Function} onViewDetails - callback для просмотра деталей
 * @param {boolean} isParticipant - участвует ли текущий пользователь
 */
export const EventCard = ({ event, onViewDetails, isParticipant = false }) => {
  if (!event) return null;

  const { title, description, date, location, imageUrl, participants = [] } = event;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          {isParticipant && (
            <Badge variant="secondary">Участвую</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatDateLong(date)} в {formatTime(date)}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{location}</span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{participants.length} участников</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewDetails?.(event)}
        >
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  );
};
