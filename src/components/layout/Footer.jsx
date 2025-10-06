import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { label: 'Главная', to: '/' },
      { label: 'О проекте', to: '/about' },
      { label: 'Мероприятия', to: '/events' },
      { label: 'Рейтинг', to: '/rating' },
    ],
    social: [
      { label: 'GitHub', icon: Github, href: '#' },
      { label: 'Email', icon: Mail, href: 'mailto:support@students.local' },
    ],
  };

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Анкеты учеников</h3>
            <p className="text-sm text-muted-foreground">
              Платформа для отслеживания достижений учеников и рейтинговой системы.
              Мотивируем к развитию и успеху!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Навигация</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Контакты</h3>
            <div className="flex space-x-4">
              {footerLinks.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Анкеты учеников. Все права защищены.
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            Сделано с <Heart className="h-4 w-4 mx-1 text-red-500" /> для наших учеников
          </p>
        </div>
      </div>
    </footer>
  );
};
