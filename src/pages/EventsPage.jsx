import { useState, useEffect } from 'react';
import { EventList } from '@/components/events/EventList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { formatDateLong, formatTime } from '@/utils/dateFormatter';
import { useAuth } from '@/hooks/useAuth';
import { getEvents } from '@/services/firestore';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Мероприятия</h1>
        <p className="text-muted-foreground">
          Узнайте о предстоящих событиях и участвуйте в школьной жизни
        </p>
      </div>

      {/* Events List */}
      <EventList
        events={events}
        loading={loading}
        onViewDetails={handleViewDetails}
        currentUserId={user?.uid}
      />

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
              </DialogHeader>

              {selectedEvent.imageUrl && (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {formatDateLong(selectedEvent.date)} в {formatTime(selectedEvent.date)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{selectedEvent.participants?.length || 0} участников</span>
                  </div>
                </div>

                {/* Participant Badge */}
                {user && selectedEvent.participants?.includes(user.uid) && (
                  <Badge variant="secondary">Вы участвуете в этом мероприятии</Badge>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Описание</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
