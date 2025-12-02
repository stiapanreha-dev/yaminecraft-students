import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Info,
  Calendar,
  Trophy,
  User,
  Shield,
  ChevronRight
} from 'lucide-react';

/**
 * Sidebar компонент для мобильной навигации и админ-панели
 */
export const Sidebar = ({ isAdmin = false, className }) => {
  const location = useLocation();

  const navigationLinks = [
    {
      label: 'Главная',
      to: '/',
      icon: Home,
      badge: null
    },
    {
      label: 'О проекте',
      to: '/about',
      icon: Info,
      badge: null
    },
    {
      label: 'Мероприятия',
      to: '/events',
      icon: Calendar,
      badge: null
    },
    {
      label: 'Рейтинг',
      to: '/rating',
      icon: Trophy,
      badge: null
    },
  ];

  const userLinks = [
    {
      label: 'Личный кабинет',
      to: '/dashboard',
      icon: User,
      badge: null
    },
  ];

  const adminLinks = [
    {
      label: 'Админ-панель',
      to: '/admin',
      icon: Shield,
      badge: 'Admin'
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const renderLink = (link) => {
    const Icon = link.icon;
    const active = isActive(link.to);

    return (
      <Link key={link.to} to={link.to}>
        <Button
          variant={active ? 'secondary' : 'ghost'}
          className={cn(
            'w-full justify-start',
            active && 'bg-accent'
          )}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{link.label}</span>
          {link.badge && (
            <Badge variant="destructive" className="ml-2">
              {link.badge}
            </Badge>
          )}
          {active && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </Link>
    );
  };

  return (
    <aside className={cn('flex flex-col space-y-4 py-4', className)}>
      {/* Navigation Section */}
      <div className="space-y-1 px-3">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Навигация
        </h2>
        <div className="space-y-1">
          {navigationLinks.map(renderLink)}
        </div>
      </div>

      <Separator />

      {/* User Section */}
      <div className="space-y-1 px-3">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Профиль
        </h2>
        <div className="space-y-1">
          {userLinks.map(renderLink)}
        </div>
      </div>

      {/* Admin Section */}
      {isAdmin && (
        <>
          <Separator />
          <div className="space-y-1 px-3">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Администрирование
            </h2>
            <div className="space-y-1">
              {adminLinks.map(renderLink)}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
