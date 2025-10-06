import { EventCard } from './EventCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

/**
 * Список мероприятий
 * @param {Array} events - массив мероприятий
 * @param {boolean} loading - состояние загрузки
 * @param {Function} onViewDetails - callback для просмотра деталей
 * @param {string} currentUserId - ID текущего пользователя
 */
export const EventList = ({
  events = [],
  loading = false,
  onViewDetails,
  currentUserId = null
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-lg font-medium text-muted-foreground">
          Пока нет мероприятий
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Скоро здесь появятся интересные события
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const isParticipant = currentUserId && event.participants?.includes(currentUserId);

        return (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={onViewDetails}
            isParticipant={isParticipant}
          />
        );
      })}
    </div>
  );
};
