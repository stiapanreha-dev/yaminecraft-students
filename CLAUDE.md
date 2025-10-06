# Контекст разработки проекта "Анкеты учеников"

**Дата начала:** 2025-10-06
**Последнее обновление:** 2025-10-07 00:45
**Текущий статус:** ✅ ПРОЕКТ ЗАВЕРШЁН И ЗАДЕПЛОЕН - Все функции реализованы и работают

---

## 📋 Описание проекта

Веб-приложение для размещения анкет учеников с системой рейтинга, достижений и личными кабинетами.

### Основные требования:
- ✅ Добавление новых учеников (фото, информация, достижения)
- ✅ Просмотр анкет учеников
- ✅ Система рейтинга (за всё время / год / месяц)
- ✅ Личные кабинеты для учеников
- ✅ Мобильная адаптация (приоритет)

### Страницы:
1. Главная страница
2. Описание проекта
3. Мероприятия
4. Рейтинг лучших учеников (всё время/год/месяц)
5. Личные кабинеты учеников

---

## 🛠 Технологический стек

### Frontend:
- **Framework:** React 18
- **Build tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

### Backend Services:
- **Authentication:** Firebase Authentication (Email/Password + Google)
- **Database:** Firebase Firestore
- **File Storage:** Base64 Data URLs (сохраняются в Firestore)
- **Hosting:** GitHub Pages (https://stiapanreha-dev.github.io/yaminecraft-students/)

### Примечания по хранению изображений:
- **Текущее решение:** Base64 Data URLs, сохраняются прямо в документах Firestore
- **Причина:** GitHub Pages не поддерживает backend серверы (MinIO API не может работать)
- **Лимит Firestore:** 1MB на документ, рекомендуется сжимать изображения до <300KB
- **Альтернативы:** Firebase Storage (требует платный план Blaze)

---

## 🔑 Credentials & Configuration

### MinIO Storage (НЕ ИСПОЛЬЗУЕТСЯ)
- **API Endpoint:** https://storage.sh3.su
- **Web Console:** https://web-storage.sh3.su
- **Access Key:** JOiCOGJU3b4Tf88Xxbxp
- **Secret Key:** T6cWSFfHbrUYVtrdTaB1CnAcrjlmkgM1XJUvVtCD
- **Bucket:** student-photos (создан, публичный доступ на чтение)
- **Примечание:** MinIO доступен, но не используется т.к. GitHub Pages не поддерживает backend серверы. Пример upload API сохранён в `/server/upload-api.js`

### Admin Account
- **Email:** admin@yaminecraft.local
- **Password:** admin123456
- **Role:** admin
- **Создан:** 2025-10-06

### Firebase Configuration
- **Account:** stiapan.reha@gmail.com
- **Project ID:** yaminecraft-students
- **Project Number:** 595423899305
- **Web App:** Student Portal
- **App ID:** 1:595423899305:web:8e34452dc70f88b71f03b8

**Firebase SDK Config:**
```javascript
{
  "projectId": "yaminecraft-students",
  "appId": "1:595423899305:web:8e34452dc70f88b71f03b8",
  "storageBucket": "yaminecraft-students.firebasestorage.app",
  "apiKey": "AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo",
  "authDomain": "yaminecraft-students.firebaseapp.com",
  "messagingSenderId": "595423899305"
}
```

### Server Access
- **SSH:** Pi4-2
- **MinIO Container:** Запущен как системный сервис (root process)
- **Nginx Proxy:**
  - storage.sh3.su → 127.0.0.1:9000 (API)
  - web-storage.sh3.su → 127.0.0.1:9001 (Console)

---

## ✅ Завершённые задачи

### 1. Инфраструктура (2025-10-06)
- ✅ Проверка MinIO сервера (доступен, но не используется)
- ✅ Создан bucket `student-photos` в MinIO
- ✅ Firebase CLI авторизован
- ✅ Проект yaminecraft-students создан
- ✅ Web приложение "Student Portal" зарегистрировано
- ✅ Получена Firebase SDK конфигурация
- ✅ Firebase Authentication настроен (Email/Password)
- ✅ Firestore Database создан
- ✅ Создан PROJECT_PLAN.md

### 2. React проект (2025-10-06)
- ✅ Инициализирован Vite + React 19.1.1
- ✅ Установлен React Router v6
- ✅ Настроен Tailwind CSS 3.4.1
- ✅ Установлен shadcn/ui (New York style)
- ✅ Установлен Firebase SDK
- ✅ Установлены Zustand, React Hook Form, Zod, Axios
- ✅ Настроен vite.config.js (base: /yaminecraft-students/)
- ✅ Создана структура папок
- ✅ Настроены переменные окружения

### 3. Базовые сервисы (2025-10-06)
- ✅ Создан src/services/firebase.js
- ✅ Создан src/services/auth.js (email/password)
- ✅ Создан src/services/firestore.js (полный CRUD)
- ✅ Создан src/store/authStore.js (Zustand)
- ✅ Создан src/components/AuthProvider.jsx (решает проблему infinite loop)

### 4. Hooks и утилиты (2025-10-06)
- ✅ Создан src/hooks/useAuth.js
- ✅ Создан src/hooks/useStudents.js
- ✅ Создан src/hooks/useRating.js
- ✅ Создан src/utils/dateFormatter.js
- ✅ Создан src/utils/validators.js

### 5. Layout компоненты (2025-10-06)
- ✅ Создан src/components/layout/Header.jsx
- ✅ Создан src/components/layout/Footer.jsx
- ✅ Установлены shadcn/ui компоненты (Button, Card, Input, Table, Dialog, Form, Avatar, Badge, Tabs, Select, Popover, Calendar)

### 6. UI компоненты (2025-10-06-07)
- ✅ Создан src/components/student/StudentCard.jsx
- ✅ Создан src/components/student/StudentProfile.jsx
- ✅ Создан src/components/rating/RatingTable.jsx
- ✅ Создан src/components/rating/RatingFilters.jsx
- ✅ Создан src/components/events/EventCard.jsx
- ✅ Создан src/components/events/EventList.jsx
- ✅ Создан src/components/admin/UserManager.jsx
- ✅ Создан src/components/admin/AchievementForm.jsx (с выбором ученика)
- ✅ Создан src/components/admin/EventForm.jsx (с ImageUpload)
- ✅ Создан src/components/ui/image-upload.jsx (drag-and-drop)

### 7. Страницы (2025-10-06)
- ✅ Создан src/pages/HomePage.jsx (с динамической статистикой)
- ✅ Создан src/pages/AboutPage.jsx
- ✅ Создан src/pages/EventsPage.jsx
- ✅ Создан src/pages/RatingPage.jsx (показывает всех студентов)
- ✅ Создан src/pages/ProfilePage.jsx
- ✅ Создан src/pages/DashboardPage.jsx
- ✅ Создан src/pages/AdminPage.jsx (полный CRUD)
- ✅ Создан src/pages/LoginPage.jsx
- ✅ Настроены роуты в App.jsx
- ✅ Добавлены защищённые роуты (PrivateRoute, AdminRoute)

### 8. Админ-панель (2025-10-06-07)
- ✅ Управление пользователями (просмотр, изменение ролей)
- ✅ Создание/редактирование/удаление достижений
- ✅ Создание/редактирование/удаление мероприятий
- ✅ Выбор ученика при создании достижения
- ✅ Автоматический пересчёт рейтинга при создании достижений
- ✅ Отображение списков достижений и мероприятий

### 9. Рейтинговая система (2025-10-06)
- ✅ Автоматический подсчёт баллов
- ✅ Фильтры (всё время / год / месяц)
- ✅ Разбивка по категориям (спорт, учёба, творчество, волонтёрство)
- ✅ Сортировка таблицы
- ✅ Создан scripts/recalculateRatings.js для исправления данных

### 10. Загрузка изображений (2025-10-07)
- ✅ Drag-and-drop интерфейс
- ✅ Валидация размера файла (5MB)
- ✅ Предпросмотр изображения
- ✅ Сохранение в base64 в Firestore
- ✅ Кнопка удаления изображения

### 11. Deployment (2025-10-06-07)
- ✅ Создан GitHub репозиторий (stiapanreha-dev/yaminecraft-students)
- ✅ Настроен GitHub Actions для автодеплоя
- ✅ Задеплоен на GitHub Pages
- ✅ URL: https://stiapanreha-dev.github.io/yaminecraft-students/
- ✅ Проверена работоспособность на production

### 12. Финальные доработки (2025-10-07)
- ✅ Исправлены все ошибки аутентификации
- ✅ Исправлена проблема infinite loop в useAuth (создан AuthProvider)
- ✅ Добавлена обработка ошибок с Toast уведомлениями
- ✅ Исправлены проблемы с отображением студентов
- ✅ Исправлены ссылки на профили (undefined userId)
- ✅ Динамическая статистика на главной странице
- ✅ Исключение админов из списка студентов
- ✅ Конвертация Firestore Timestamp в Date при редактировании

---

## 📊 Структура базы данных Firestore

### Collection: `users`
```javascript
{
  uid: string,              // Firebase UID
  email: string,
  role: 'student' | 'admin',
  profile: {
    firstName: string,
    lastName: string,
    middleName: string,
    birthDate: timestamp,
    photoUrl: string,       // MinIO URL
    class: string,
    bio: string
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `achievements`
```javascript
{
  id: string,
  userId: string,           // ref to users
  title: string,
  description: string,
  category: string,         // спорт, учёба, творчество, волонтёрство
  points: number,
  date: timestamp,
  proofUrls: string[],      // MinIO URLs
  verifiedBy: string,       // admin uid
  verifiedAt: timestamp,
  createdAt: timestamp
}
```

### Collection: `events`
```javascript
{
  id: string,
  title: string,
  description: string,
  date: timestamp,
  location: string,
  imageUrl: string,         // MinIO URL
  participants: string[],   // user uids
  createdBy: string,        // admin uid
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Collection: `ratings`
```javascript
{
  userId: string,
  totalPoints: number,
  monthPoints: number,      // текущий месяц
  yearPoints: number,       // текущий год
  lastUpdated: timestamp,
  breakdown: {
    sport: number,
    study: number,
    creativity: number,
    volunteer: number
  }
}
```

---

## 📁 Планируемая структура проекта

```
yaminecraft/
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui компоненты
│   │   ├── layout/          # Header, Footer, Sidebar
│   │   ├── student/         # StudentCard, StudentProfile
│   │   ├── rating/          # RatingTable, RatingFilters
│   │   ├── events/          # EventCard, EventList
│   │   └── admin/           # AdminPanel, UserManager
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── RatingPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/
│   │   ├── firebase.js      # Firebase config
│   │   ├── auth.js          # Аутентификация
│   │   ├── firestore.js     # CRUD операции
│   │   └── minio.js         # Работа с MinIO
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStudents.js
│   │   └── useRating.js
│   ├── store/
│   │   └── authStore.js
│   ├── utils/
│   │   ├── dateFormatter.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .env.local
├── vite.config.js
├── tailwind.config.js
├── package.json
├── PROJECT_PLAN.md
└── CLAUDE.md
```

---

## 🔐 Переменные окружения (.env.local)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD4hZAIr06lvMtSqhweF7bOP0CnnETQclo
VITE_FIREBASE_AUTH_DOMAIN=yaminecraft-students.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yaminecraft-students
VITE_FIREBASE_STORAGE_BUCKET=yaminecraft-students.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=595423899305
VITE_FIREBASE_APP_ID=1:595423899305:web:8e34452dc70f88b71f03b8

# MinIO Configuration
VITE_MINIO_ENDPOINT=https://storage.sh3.su
VITE_MINIO_ACCESS_KEY=JOiCOGJU3b4Tf88Xxbxp
VITE_MINIO_SECRET_KEY=T6cWSFfHbrUYVtrdTaB1CnAcrjlmkgM1XJUvVtCD
VITE_MINIO_BUCKET=student-photos
```

---

## 📋 TODO Лист разработки

### ✅ ВСЕ ЭТАПЫ ЗАВЕРШЕНЫ

Все основные функции реализованы и работают. Проект задеплоен на GitHub Pages.

## 🔧 Критические исправления

### Проблема: Infinite Loop в Auth System
**Симптомы:** AdminPage пустая, useEffect вызывается 4+ раза, бесконечные ререндеры
**Причина:** Каждый компонент, использующий useAuth, создавал свой собственный onAuthStateChanged listener
**Решение:**
1. Создан `/src/components/AuthProvider.jsx` - централизованный провайдер аутентификации
2. Перенесён onAuthStateChanged в AuthProvider (запускается один раз)
3. Модифицирован useAuth - теперь только читает состояние из Zustand
4. App.jsx обёрнут в `<AuthProvider>`

**Файлы:**
- `/src/components/AuthProvider.jsx` (новый)
- `/src/hooks/useAuth.js` (удалён useEffect)
- `/src/App.jsx` (добавлен AuthProvider wrapper)

### Проблема: Достижения без userId
**Симптомы:** Созданные достижения не отображаются, userId = undefined в базе
**Причина:** AchievementForm не имел поля для выбора ученика
**Решение:**
1. Добавлен dropdown со списком студентов в AchievementForm
2. Обновлён achievementSchema - userId теперь обязательное поле
3. AdminPage передаёт список users в форму

**Файлы:**
- `/src/components/admin/AchievementForm.jsx` (добавлено поле userId)
- `/src/utils/validators.js` (userId required)

### Проблема: Рейтинг не обновляется автоматически
**Симптомы:** После создания достижения баллы не добавляются в ratings
**Причина:** Отсутствовала автоматическая логика пересчёта
**Решение:**
1. Добавлен автоматический пересчёт в handleCreateAchievement
2. Создан скрипт `/scripts/recalculateRatings.js` для исправления старых данных
3. Обновление ratings происходит при каждом создании достижения

**Файлы:**
- `/src/pages/AdminPage.jsx` (handleCreateAchievement)
- `/scripts/recalculateRatings.js` (новый)

### Проблема: Белый экран при редактировании
**Симптомы:** Клик на "Редактировать" показывает белый экран
**Причина:** Firestore Timestamp не конвертируется в Date для React Hook Form
**Решение:** Добавлена конвертация в handleEditAchievement и handleEditEvent

```javascript
const formData = {
  ...achievement,
  date: achievement.date?.toDate ? achievement.date.toDate() : new Date(achievement.date)
};
```

**Файлы:**
- `/src/pages/AdminPage.jsx` (handleEditAchievement, handleEditEvent)

---

## 📝 Как продолжить после перерыва

### Проект завершён! ✅

**Production URL:** https://stiapanreha-dev.github.io/yaminecraft-students/
**GitHub Repo:** https://github.com/stiapanreha-dev/yaminecraft-students
**Admin Login:** admin@yaminecraft.local / admin123456

Все основные функции работают:
- ✅ Регистрация и аутентификация
- ✅ Просмотр анкет учеников
- ✅ Система рейтинга с фильтрами
- ✅ Личные кабинеты
- ✅ Админ-панель с полным CRUD
- ✅ Drag-and-drop загрузка изображений
- ✅ Автоматический пересчёт рейтинга

### Возможные улучшения в будущем:

1. **Миграция на Firebase Storage** (требует платный план Blaze)
   - Убрать base64 хранение
   - Создать Cloud Functions для resize изображений
   - Обновить ImageUpload компонент для загрузки в Firebase Storage

2. **Оптимизация производительности**
   - Добавить lazy loading для изображений
   - Внедрить React.memo для StudentCard
   - Добавить виртуализацию для длинных списков

3. **Новые функции**
   - Email уведомления о новых достижениях
   - Экспорт рейтинга в PDF/Excel
   - Комментарии к достижениям
   - История изменений рейтинга (графики)

4. **Безопасность**
   - Обновить Firestore Rules для production
   - Добавить rate limiting
   - Внедрить 2FA для админов

---

## 🏗️ Архитектура и ключевые решения

### AuthProvider Pattern
**Проблема:** Infinite loop из-за множественных onAuthStateChanged listeners
**Решение:** Централизованный AuthProvider компонент

```javascript
// /src/components/AuthProvider.jsx
export const AuthProvider = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getUserById(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []); // Запускается один раз

  return children;
};
```

**Использование:**
```javascript
// /src/App.jsx
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>
```

### Base64 Image Storage
**Решение:** Хранение изображений в Firestore как Data URLs

**Почему:**
- GitHub Pages не поддерживает backend (MinIO API требует серверный код)
- Firebase Storage требует платный план Blaze
- Base64 приемлемо для небольших изображений (<300KB)

**Компонент:**
```javascript
// /src/components/ui/image-upload.jsx
const handleFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер 5MB');
    return;
  }
  const reader = new FileReader();
  reader.onloadend = () => {
    onChange(reader.result); // Data URL (base64)
  };
  reader.readAsDataURL(file);
};
```

### Automatic Rating Calculation
**Решение:** Пересчёт рейтинга при создании/обновлении достижений

```javascript
// /src/pages/AdminPage.jsx
const handleCreateAchievement = async (data) => {
  await createAchievement(data);

  // Автоматический пересчёт рейтинга
  const currentRating = await getRatingByUserId(data.userId);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const achievementDate = data.date instanceof Date ? data.date : new Date(data.date);
  let yearPoints = currentRating?.yearPoints || 0;
  let monthPoints = currentRating?.monthPoints || 0;

  if (achievementDate.getFullYear() === currentYear) {
    yearPoints += data.points;
    if (achievementDate.getMonth() === currentMonth) {
      monthPoints += data.points;
    }
  }

  const newRating = {
    userId: data.userId,
    totalPoints: (currentRating?.totalPoints || 0) + data.points,
    yearPoints,
    monthPoints,
    breakdown: {
      sport: (currentRating?.breakdown?.sport || 0) + (data.category === 'sport' ? data.points : 0),
      study: (currentRating?.breakdown?.study || 0) + (data.category === 'study' ? data.points : 0),
      creativity: (currentRating?.breakdown?.creativity || 0) + (data.category === 'creativity' ? data.points : 0),
      volunteer: (currentRating?.breakdown?.volunteer || 0) + (data.category === 'volunteer' ? data.points : 0)
    },
    lastUpdated: new Date()
  };

  await updateRating(data.userId, newRating);
};
```

### In-Memory Sorting (Avoiding Firestore Indexes)
**Проблема:** Firestore требует создания composite indexes для where + orderBy
**Решение:** Сортировка в JavaScript после получения данных

```javascript
// /src/hooks/useStudents.js
const querySnapshot = await getDocs(collection(db, 'users'));
const studentsData = querySnapshot.docs
  .map(doc => ({ id: doc.id, uid: doc.id, ...doc.data() }))
  .filter(user => user.role === 'student');

// Сортировка в памяти вместо Firestore orderBy
studentsData.sort((a, b) => {
  const nameA = `${a.profile?.lastName || ''} ${a.profile?.firstName || ''}`;
  const nameB = `${b.profile?.lastName || ''} ${b.profile?.firstName || ''}`;
  return nameA.localeCompare(nameB);
});
```

### Firestore Timestamp Handling
**Проблема:** React Hook Form не работает с Firestore Timestamps
**Решение:** Конвертация при редактировании

```javascript
const handleEditAchievement = (achievement) => {
  const formData = {
    ...achievement,
    date: achievement.date?.toDate
      ? achievement.date.toDate()
      : new Date(achievement.date)
  };
  setEditingAchievement(formData);
  setAchievementDialogOpen(true);
};
```

### Protected Routes
**Реализация:** HOC для проверки авторизации и роли

```javascript
// /src/App.jsx
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Загрузка...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Загрузка...</div>;
  if (!user) return <Navigate to="/login" />;
  return user.role === 'admin' ? children : <Navigate to="/" />;
};
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

## 🎨 Дизайн

### Цветовая схема:
- **Primary:** Синий (#3B82F6)
- **Secondary:** Зелёный (#10B981)
- **Accent:** Жёлтый (#F59E0B)
- **Background:** Белый/Серый (#F9FAFB)
- **Text:** Тёмно-серый (#1F2937)

### Адаптивность:
- Mobile-first подход
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 📌 Важные заметки

1. **MinIO CORS:** Может потребоваться настройка CORS политики для работы с веб-приложением
2. **GitHub Pages:** Использовать HashRouter для client-side routing
3. **Firestore Rules:** Установить правила безопасности перед production
4. **Image Optimization:** Генерировать thumbnails для быстрой загрузки
5. **Offline Support:** Рассмотреть Service Worker для PWA (опционально)

---

## 🚀 Прогресс разработки

### ✅ ПРОЕКТ ЗАВЕРШЁН (2025-10-07)

**GitHub Repository:** https://github.com/stiapanreha-dev/yaminecraft-students
**Production URL:** https://stiapanreha-dev.github.io/yaminecraft-students/
**Latest Commit:** c6ffa60 (Update CLAUDE.md with current progress)

### Статистика проекта:
- **Компонентов:** 20+
- **Страниц:** 8
- **Сервисов:** 4 (firebase, auth, firestore, minio-example)
- **Hooks:** 3 (useAuth, useStudents, useRating)
- **Коллекций Firestore:** 4 (users, achievements, events, ratings)
- **Строк кода:** ~3000+

### Реализованные функции:
1. ✅ Аутентификация (Email/Password)
2. ✅ Регистрация учеников и админов
3. ✅ Просмотр анкет учеников с фото
4. ✅ Система рейтинга (всё время / год / месяц)
5. ✅ Личные кабинеты учеников
6. ✅ Админ-панель с CRUD для достижений и мероприятий
7. ✅ Drag-and-drop загрузка изображений
8. ✅ Автоматический пересчёт рейтинга
9. ✅ Динамическая статистика на главной
10. ✅ Защищённые роуты (PrivateRoute, AdminRoute)
11. ✅ Toast уведомления
12. ✅ Адаптивный дизайн (mobile-first)

### Известные ограничения:
- Изображения хранятся в base64 (лимит ~300KB на изображение)
- Firebase Storage не используется (требует платный план)
- MinIO доступен, но не используется (GitHub Pages не поддерживает backend)

---

## 📚 Итоговое резюме

### Что было сделано за сессию (2025-10-06 до 2025-10-07):

**Создан полнофункциональный веб-портал для учеников** с системой рейтинга и достижений.

**Ключевые моменты разработки:**

1. **Проблема infinite loop** - самая критичная проблема сессии
   - Обнаружено: AdminPage была пустой из-за бесконечных ререндеров
   - Решено: Создан AuthProvider для централизации Firebase auth listener
   - Результат: Приложение работает стабильно

2. **Автоматизация рейтинга** - важная бизнес-логика
   - Реализован автоматический пересчёт при создании достижений
   - Учитываются периоды (всё время, год, месяц)
   - Разбивка по категориям (спорт, учёба, творчество, волонтёрство)

3. **Drag-and-drop загрузка изображений**
   - Интуитивный интерфейс для загрузки фото мероприятий
   - Валидация размера файла
   - Base64 хранение (компромисс из-за ограничений GitHub Pages)

4. **Полный CRUD в админ-панели**
   - Управление достижениями (создание, редактирование, удаление)
   - Управление мероприятиями
   - Управление ролями пользователей

**Технические достижения:**
- React 19.1.1 + Vite 7.1.9 (современный стек)
- shadcn/ui для UI компонентов (красивый и консистентный дизайн)
- Zustand для state management (легковесная альтернатива Redux)
- Firebase Firestore (масштабируемая база данных)
- GitHub Actions для автодеплоя (CI/CD)

**Deployment:**
- Production URL: https://stiapanreha-dev.github.io/yaminecraft-students/
- Автоматический деплой при push в master
- Работает без backend сервера (JAMstack архитектура)

**Для разработчика в будущем:**
- Все критические решения и проблемы задокументированы в разделе "Критические исправления"
- Архитектурные паттерны описаны в разделе "Архитектура и ключевые решения"
- Admin credentials: admin@yaminecraft.local / admin123456
- Пример MinIO upload API сохранён в `/server/upload-api.js` (на случай миграции)
