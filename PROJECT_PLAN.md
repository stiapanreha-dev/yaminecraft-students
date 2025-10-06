# План разработки сайта "Анкеты учеников"

## 📋 Общее описание проекта

Веб-приложение для размещения анкет учеников с системой рейтинга, достижений и личными кабинетами.

---

## 🎯 Основные требования

### Функциональные требования:
- ✅ Добавление новых учеников (фото, информация, достижения)
- ✅ Просмотр анкет учеников
- ✅ Система рейтинга (за всё время / год / месяц)
- ✅ Личные кабинеты для учеников
- ✅ Мобильная адаптация (приоритет)

### Страницы:
1. **Главная** - приветствие, статистика проекта
2. **О проекте** - описание инициативы
3. **Мероприятия** - список событий с фильтрацией по датам
4. **Рейтинг** - таблица учеников с фильтрами (время/категория)
5. **Профиль ученика** - детальная информация, достижения, фотогалерея
6. **Личный кабинет** - редактирование своего профиля
7. **Админ-панель** - управление пользователями и контентом

---

## 🛠 Технологический стек

### Frontend:
- **Framework:** React 18
- **Build tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + shadcn/ui компоненты
- **State Management:** Zustand (легковесный)
- **Forms:** React Hook Form + Zod валидация
- **HTTP Client:** Axios

### Backend Services:
- **Authentication:** Firebase Authentication (Email/Password + Google)
- **Database:** Firebase Firestore
- **File Storage:** MinIO (https://storage.sh3.su)
- **Hosting:** GitHub Pages

### DevOps:
- **Version Control:** Git
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages (gh-pages branch)

---

## 📊 Структура базы данных (Firestore)

### Collections:

#### `users` (коллекция пользователей)
```
{
  uid: string (Firebase UID)
  email: string
  role: 'student' | 'admin'
  profile: {
    firstName: string
    lastName: string
    middleName: string
    birthDate: timestamp
    photoUrl: string (MinIO URL)
    class: string
    bio: string
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `achievements` (достижения)
```
{
  id: string
  userId: string (ref to users)
  title: string
  description: string
  category: string (спорт, учёба, творчество, волонтёрство, etc)
  points: number
  date: timestamp
  proofUrls: string[] (MinIO URLs)
  verifiedBy: string (admin uid)
  verifiedAt: timestamp
  createdAt: timestamp
}
```

#### `events` (мероприятия)
```
{
  id: string
  title: string
  description: string
  date: timestamp
  location: string
  imageUrl: string (MinIO URL)
  participants: string[] (user uids)
  createdBy: string (admin uid)
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `ratings` (рейтинги - автоматически вычисляемые)
```
{
  userId: string
  totalPoints: number
  monthPoints: number (текущий месяц)
  yearPoints: number (текущий год)
  lastUpdated: timestamp
  breakdown: {
    sport: number
    study: number
    creativity: number
    volunteer: number
  }
}
```

---

## 🎨 Дизайн и UI

### Цветовая схема:
- Primary: Синий (#3B82F6)
- Secondary: Зелёный (#10B981)
- Accent: Жёлтый (#F59E0B)
- Background: Белый/Серый (#F9FAFB)
- Text: Тёмно-серый (#1F2937)

### Компоненты (shadcn/ui):
- Button, Card, Dialog, Form, Input, Table
- Avatar, Badge, Tabs, Select, Calendar
- Toast (уведомления), Skeleton (загрузка)

### Адаптивность:
- Mobile-first подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 📁 Структура проекта

```
yaminecraft/
├── public/
│   └── logo.png
├── src/
│   ├── components/          # React компоненты
│   │   ├── ui/              # shadcn/ui компоненты
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   ├── student/         # StudentCard, StudentProfile
│   │   ├── rating/          # RatingTable, RatingFilters
│   │   ├── events/          # EventCard, EventList
│   │   └── admin/           # AdminPanel, UserManager
│   ├── pages/               # Страницы приложения
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── RatingPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/            # API и сервисы
│   │   ├── firebase.js      # Firebase config
│   │   ├── auth.js          # Аутентификация
│   │   ├── firestore.js     # CRUD операции
│   │   └── minio.js         # Работа с MinIO
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useStudents.js
│   │   └── useRating.js
│   ├── store/               # Zustand state management
│   │   └── authStore.js
│   ├── utils/               # Утилиты
│   │   ├── dateFormatter.js
│   │   └── validators.js
│   ├── App.jsx              # Главный компонент
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind styles
├── .env.example             # Пример переменных окружения
├── .env.local               # Локальные переменные (не в git)
├── vite.config.js           # Vite конфигурация
├── tailwind.config.js       # Tailwind конфигурация
├── package.json
└── PROJECT_PLAN.md          # Этот документ
```

---

## 🔐 Переменные окружения (.env.local)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=yaminecraft-students.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yaminecraft-students
VITE_FIREBASE_STORAGE_BUCKET=yaminecraft-students.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# MinIO Configuration
VITE_MINIO_ENDPOINT=https://storage.sh3.su
VITE_MINIO_ACCESS_KEY=admin
VITE_MINIO_SECRET_KEY=bJBAkX9RjyM5jRrR
VITE_MINIO_BUCKET=student-photos
```

---

## 📝 Этапы разработки

### Этап 1: Инициализация проекта (1-2 часа)
- [x] Создание плана проекта
- [ ] Инициализация Vite + React
- [ ] Установка зависимостей (Tailwind, shadcn/ui, React Router)
- [ ] Настройка конфигурации (vite.config.js, tailwind.config.js)
- [ ] Создание базовой структуры папок

### Этап 2: Настройка Backend (1-2 часа)
- [ ] Создание Firebase Web App в консоли
- [ ] Настройка Firebase Authentication (Email/Password, Google)
- [ ] Создание Firestore Database
- [ ] Настройка правил безопасности Firestore
- [ ] Создание bucket в MinIO для хранения фото
- [ ] Настройка CORS для MinIO

### Этап 3: Интеграция сервисов (2-3 часа)
- [ ] Подключение Firebase SDK
- [ ] Реализация auth.js (регистрация, вход, выход)
- [ ] Реализация firestore.js (CRUD операции)
- [ ] Реализация minio.js (загрузка/получение файлов)
- [ ] Создание custom hooks (useAuth, useStudents, useRating)

### Этап 4: UI компоненты (3-4 часа)
- [ ] Установка shadcn/ui компонентов
- [ ] Создание Layout компонентов (Header, Footer, Sidebar)
- [ ] Создание StudentCard, StudentProfile
- [ ] Создание RatingTable с фильтрами
- [ ] Создание EventCard, EventList
- [ ] Адаптация под мобильные устройства

### Этап 5: Страницы приложения (4-5 часов)
- [ ] HomePage - главная страница
- [ ] AboutPage - о проекте
- [ ] EventsPage - мероприятия
- [ ] RatingPage - рейтинг с фильтрами
- [ ] ProfilePage - просмотр профиля ученика
- [ ] DashboardPage - личный кабинет
- [ ] AdminPage - админ-панель

### Этап 6: Административная панель (3-4 часа)
- [ ] Форма добавления нового ученика
- [ ] Загрузка фото в MinIO
- [ ] Управление достижениями
- [ ] Модерация контента
- [ ] Управление мероприятиями

### Этап 7: Рейтинговая система (2-3 часа)
- [ ] Автоматический подсчёт баллов
- [ ] Фильтры (всё время / год / месяц)
- [ ] Категории достижений
- [ ] Cloud Functions для обновления рейтинга

### Этап 8: Тестирование и оптимизация (2-3 часа)
- [ ] Тестирование на мобильных устройствах
- [ ] Оптимизация загрузки изображений
- [ ] Lazy loading компонентов
- [ ] SEO оптимизация (meta теги)
- [ ] Проверка безопасности (Firestore rules)

### Этап 9: Deployment (1-2 часа)
- [ ] Настройка GitHub Actions для автодеплоя
- [ ] Конфигурация для GitHub Pages (base path)
- [ ] Первый деплой
- [ ] Проверка работоспособности на production
- [ ] Настройка кастомного домена (опционально)

---

## 🚀 Команды для запуска

```bash
# Установка зависимостей
npm install

# Разработка (dev server)
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Деплой на GitHub Pages
npm run deploy
```

---

## 🔒 Правила безопасности Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Пользователи могут читать все профили
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     (request.auth.uid == userId ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Достижения может создавать только админ
    match /achievements/{achievementId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null &&
                                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Мероприятия
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Рейтинги только на чтение
    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if false; // Обновляются через Cloud Functions
    }
  }
}
```

---

## 📱 Мобильная оптимизация

### Приоритеты:
1. Touch-friendly кнопки (минимум 44x44px)
2. Адаптивная типографика (rem units)
3. Оптимизированные изображения (WebP, lazy loading)
4. Быстрая загрузка (code splitting, tree shaking)
5. Offline support (Service Worker - опционально)

### Тестирование:
- Chrome DevTools (device emulation)
- Реальные устройства (iOS, Android)
- Lighthouse аудит (Performance, Accessibility)

---

## 🎓 Роли пользователей

### Student (Ученик):
- Просмотр всех профилей и рейтинга
- Редактирование своего профиля
- Просмотр своих достижений
- Участие в мероприятиях

### Admin (Администратор):
- Все права ученика +
- Добавление новых учеников
- Управление достижениями всех учеников
- Создание и управление мероприятиями
- Модерация контента

---

## 📊 MVP (Minimum Viable Product)

### Обязательные функции для первой версии:
- ✅ Регистрация и вход (Email + Google)
- ✅ Просмотр списка учеников
- ✅ Рейтинговая таблица (базовая)
- ✅ Профиль ученика с достижениями
- ✅ Админ-панель для добавления учеников
- ✅ Загрузка фото в MinIO
- ✅ Мобильная адаптация

### Функции для будущих версий:
- 🔄 Система уведомлений
- 🔄 Экспорт рейтинга в PDF/Excel
- 🔄 Социальные функции (лайки, комментарии)
- 🔄 Достижения с бейджами
- 🔄 Интеграция с календарём
- 🔄 Многоязычность (i18n)

---

## 🐛 Потенциальные проблемы и решения

### 1. CORS ошибки при работе с MinIO
**Решение:** Настроить CORS политику в MinIO:
```bash
mc alias set myminio https://storage.sh3.su admin bJBAkX9RjyM5jRrR
mc admin config set myminio api cors_allow_origin="*"
```

### 2. GitHub Pages не поддерживает client-side routing
**Решение:** Использовать HashRouter или добавить 404.html fallback

### 3. Медленная загрузка больших изображений
**Решение:**
- Генерация thumbnails при загрузке
- Использование WebP формата
- Lazy loading компонентов

### 4. Firestore limitations (бесплатный tier)
**Решение:**
- Оптимизация запросов
- Кэширование на клиенте
- Pagination для больших списков

---

## 📞 Контакты и ресурсы

### Документация:
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Docs](https://firebase.google.com/docs)
- [MinIO Docs](https://min.io/docs/minio/linux/index.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### MinIO Access:
- Endpoint: https://storage.sh3.su
- Console: https://web-storage.sh3.su
- User: admin
- Pass: bJBAkX9RjyM5jRrR

### Firebase Project:
- Project ID: yaminecraft-students
- Console: https://console.firebase.google.com/

---

**Дата создания:** 2025-10-06
**Версия плана:** 1.0
**Статус:** В разработке
