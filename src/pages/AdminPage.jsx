import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserManager } from '@/components/admin/UserManager';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { EventForm } from '@/components/admin/EventForm';
import { Users, Award, Calendar, Plus } from 'lucide-react';
import { getAllUsers, updateUser, createAchievement, createEvent } from '@/services/firestore';
import { toast } from 'sonner';

export const AdminPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      toast.success('Роль пользователя успешно изменена');
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Ошибка изменения роли');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleCreateAchievement = async (data) => {
    try {
      setSubmitLoading(true);
      await createAchievement(data);
      toast.success('Достижение успешно создано');
      setAchievementDialogOpen(false);
    } catch (error) {
      console.error('Error creating achievement:', error);
      toast.error('Ошибка создания достижения');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateEvent = async (data) => {
    try {
      setSubmitLoading(true);
      await createEvent(data);
      toast.success('Мероприятие успешно создано');
      setEventDialogOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Ошибка создания мероприятия');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Админ-панель</h1>
          <p className="text-muted-foreground">
            Управление пользователями, достижениями и мероприятиями
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Учеников</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'student').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторов</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="h-4 w-4 mr-2" />
            Достижения
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Мероприятия
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManager
                users={users}
                onChangeRole={handleChangeRole}
                onViewProfile={handleViewProfile}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAchievementDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить достижение
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Управление достижениями</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Список достижений будет отображаться здесь
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setEventDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить мероприятие
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Управление мероприятиями</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Список мероприятий будет отображаться здесь
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Dialog */}
      <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить достижение</DialogTitle>
          </DialogHeader>
          <AchievementForm
            onSubmit={handleCreateAchievement}
            onCancel={() => setAchievementDialogOpen(false)}
            loading={submitLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Добавить мероприятие</DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setEventDialogOpen(false)}
            loading={submitLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
