# Контекст разработки проекта "Анкеты учеников"

**Дата начала:** 2025-10-06
**Текущий статус:** Подготовка инфраструктуры завершена, готовы к инициализации React проекта

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
- **File Storage:** MinIO (https://storage.sh3.su)
- **Hosting:** GitHub Pages

---

## 🔑 Credentials & Configuration

### MinIO Storage
- **API Endpoint:** https://storage.sh3.su
- **Web Console:** https://web-storage.sh3.su
- **Access Key:** JOiCOGJU3b4Tf88Xxbxp
- **Secret Key:** T6cWSFfHbrUYVtrdTaB1CnAcrjlmkgM1XJUvVtCD
- **Bucket:** student-photos (создан, публичный доступ на чтение)

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

### 1. Проверка MinIO
- ✅ Контейнер MinIO работает (процесс PID 2330)
- ✅ API доступен через https://storage.sh3.su
- ✅ Web консоль доступна через https://web-storage.sh3.su
- ✅ Проверен доступ с новыми credentials
- ✅ Создан bucket `student-photos`
- ✅ Настроена публичная политика для чтения файлов

**MinIO Python SDK проверка:**
```python
from minio import Minio

client = Minio(
    'storage.sh3.su',
    access_key='JOiCOGJU3b4Tf88Xxbxp',
    secret_key='T6cWSFfHbrUYVtrdTaB1CnAcrjlmkgM1XJUvVtCD',
    secure=True
)

# Список buckets: hrbot-resumes, student-photos
```

### 2. Проверка Firebase
- ✅ Firebase CLI авторизован (stiapan.reha@gmail.com)
- ✅ Проект yaminecraft-students существует
- ✅ Web приложение "Student Portal" зарегистрировано
- ✅ Получена SDK конфигурация

### 3. Документация
- ✅ Создан PROJECT_PLAN.md с детальным планом разработки
- ✅ Создан CLAUDE.md (этот файл) с контекстом проекта

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

### Этап 1: Подготовка инфраструктуры ✅
- [x] Создать план проекта (PROJECT_PLAN.md)
- [x] Проверить доступ к MinIO
- [x] Создать bucket student-photos в MinIO
- [x] Проверить Firebase авторизацию
- [x] Получить Firebase SDK конфигурацию
- [x] Сохранить контекст в CLAUDE.md

### Этап 2: Настройка Firebase Console (Вручную) ⏳
- [ ] Включить Authentication → Email/Password
- [ ] Включить Authentication → Google Sign-In
- [ ] Создать Firestore Database (начать в test mode)
- [ ] Настроить правила безопасности Firestore

### Этап 3: Инициализация React проекта 🔄
- [ ] Создать Vite + React проект
- [ ] Установить базовые зависимости (React Router, Tailwind CSS)
- [ ] Установить Firebase SDK
- [ ] Установить shadcn/ui CLI и компоненты
- [ ] Установить дополнительные библиотеки (Zustand, React Hook Form, Zod, Axios)
- [ ] Настроить vite.config.js (алиасы, GitHub Pages base)
- [ ] Настроить tailwind.config.js (цветовая схема, breakpoints)
- [ ] Создать структуру папок (components, pages, services, hooks, store, utils)
- [ ] Создать .env.local с переменными окружения
- [ ] Создать .env.example для документации

### Этап 4: Интеграция сервисов 🔄
- [ ] Создать src/services/firebase.js (инициализация Firebase)
- [ ] Создать src/services/auth.js (регистрация, вход, выход, Google OAuth)
- [ ] Создать src/services/firestore.js (CRUD для users, achievements, events, ratings)
- [ ] Создать src/services/minio.js (загрузка/получение файлов)
- [ ] Создать src/store/authStore.js (Zustand store для авторизации)
- [ ] Создать src/hooks/useAuth.js (хук для работы с авторизацией)
- [ ] Создать src/hooks/useStudents.js (хук для работы с учениками)
- [ ] Создать src/hooks/useRating.js (хук для работы с рейтингом)

### Этап 5: Разработка Layout и UI компонентов 🔄
- [ ] Установить shadcn/ui компоненты (Button, Card, Input, Table, Dialog, Form, Avatar, Badge, Tabs, Select, Toast)
- [ ] Создать src/components/layout/Header.jsx (навигация, профиль пользователя)
- [ ] Создать src/components/layout/Footer.jsx
- [ ] Создать src/components/layout/Sidebar.jsx (для мобильных)
- [ ] Создать src/components/student/StudentCard.jsx
- [ ] Создать src/components/student/StudentProfile.jsx
- [ ] Создать src/components/rating/RatingTable.jsx
- [ ] Создать src/components/rating/RatingFilters.jsx
- [ ] Создать src/components/events/EventCard.jsx
- [ ] Создать src/components/events/EventList.jsx
- [ ] Создать src/components/admin/UserManager.jsx
- [ ] Создать src/components/admin/AchievementForm.jsx
- [ ] Создать src/components/admin/EventForm.jsx

### Этап 6: Разработка страниц 🔄
- [ ] Создать src/pages/HomePage.jsx (приветствие, статистика)
- [ ] Создать src/pages/AboutPage.jsx (описание проекта)
- [ ] Создать src/pages/EventsPage.jsx (список мероприятий с фильтрацией)
- [ ] Создать src/pages/RatingPage.jsx (рейтинг с фильтрами всё время/год/месяц)
- [ ] Создать src/pages/ProfilePage.jsx (профиль ученика)
- [ ] Создать src/pages/DashboardPage.jsx (личный кабинет)
- [ ] Создать src/pages/AdminPage.jsx (админ-панель)
- [ ] Создать src/pages/LoginPage.jsx (вход/регистрация)
- [ ] Настроить React Router в src/App.jsx
- [ ] Добавить защищённые роуты (PrivateRoute, AdminRoute)

### Этап 7: Административная панель 🔄
- [ ] Форма добавления нового ученика с загрузкой фото в MinIO
- [ ] Форма управления достижениями
- [ ] Форма создания/редактирования мероприятий
- [ ] Модерация контента (одобрение достижений)
- [ ] Управление ролями пользователей

### Этап 8: Рейтинговая система 🔄
- [ ] Автоматический подсчёт баллов на основе достижений
- [ ] Реализация фильтров (всё время / год / месяц)
- [ ] Разбивка по категориям достижений
- [ ] Сортировка и пагинация таблицы рейтинга

### Этап 9: Мобильная адаптация и оптимизация 🔄
- [ ] Тестирование на мобильных устройствах (Chrome DevTools)
- [ ] Оптимизация загрузки изображений (lazy loading)
- [ ] Code splitting и tree shaking
- [ ] Lighthouse аудит (Performance, Accessibility, SEO)
- [ ] Добавить скелетоны для загрузки (Skeleton components)
- [ ] Оптимизировать Firestore запросы

### Этап 10: Deployment 🔄
- [ ] Создать GitHub репозиторий
- [ ] Настроить vite.config.js для GitHub Pages (base path)
- [ ] Создать .github/workflows/deploy.yml (GitHub Actions)
- [ ] Установить gh-pages пакет
- [ ] Добавить npm run deploy скрипт
- [ ] Первый деплой на GitHub Pages
- [ ] Проверка работоспособности на production
- [ ] Настройка кастомного домена (опционально)

### Этап 11: Финальные доработки 🔄
- [ ] Установить правила безопасности Firestore для production
- [ ] Настроить CORS для MinIO (если нужно)
- [ ] Добавить обработку ошибок и Toast уведомления
- [ ] Написать README.md с инструкциями
- [ ] Документация API (JSDoc комментарии)
- [ ] Финальное тестирование всех функций

---

## 📝 Как продолжить после перерыва

Чтобы продолжить работу в новой сессии:

1. Откройте этот файл: `CLAUDE.md`
2. Скажите Claude: **"Продолжи разработку с того места, где остановились по CLAUDE.md"**
3. Claude прочитает TODO-лист и продолжит с первой незавершённой задачи

**Текущий этап:** Этап 2 - Настройка Firebase Console (необходимо выполнить вручную в браузере)

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

## 🚀 Готово к разработке

Вся инфраструктура настроена:
- ✅ MinIO bucket создан и доступен
- ✅ Firebase проект настроен
- ✅ Конфигурации получены
- ✅ План разработки готов

**Следующий шаг:** Инициализация React + Vite проекта
