# HyperLink — Умные ссылки для музыкантов

Полноценное SaaS-приложение для создания умных ссылок (Smart Links) для музыкантов, подкастеров и лейблов.

## 🚀 Возможности

- **Умные ссылки** — одна ссылка на все стриминговые площадки
- **Адаптивный роутинг** — автоматическая сортировка площадок по геолокации и устройству
- **Аналитика** — детальная статистика кликов, просмотров, конверсии
- **Pre-save кампании** — интеграция с Spotify и Apple Music
- **Кастомизация** — настройка цветов, шрифтов, фоновых изображений
- **Виджеты** — таймер обратного отсчёта, YouTube видео, аудио-превью
- **Ретаргетинг** — интеграция Facebook Pixel и VK Pixel (Pro)
- **Кастомный домен** — подключение своего домена (Pro)

## 🛠 Технологии

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Routing**: React Router v6 (HashRouter)
- **Storage**: LocalStorage (эмуляция базы данных)
- **Build**: Vite
- **Icons**: Lucide React

## 📦 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Проверка типов
npm run typecheck
```

## 🌐 Деплой на GitHub Pages

Проект настроен для автоматического деплоя через GitHub Actions.

### Настройка:

1. **Создайте репозиторий на GitHub**

2. **Запушьте код**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Включите GitHub Pages**:
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите "GitHub Actions"
   - Workflow уже настроен в `.github/workflows/deploy.yml`

4. **Дождитесь завершения деплоя**:
   - Перейдите во вкладку "Actions"
   - Дождитесь успешного завершения workflow
   - Сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Демо-доступ

После деплоя войдите с демо-аккаунтом:
- **Email**: `demo@hyperlink.app`
- **Пароль**: `demo`

## 📁 Структура проекта

```
hyperlink/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── 404.html                # Обработка 404 для SPA
├── src/
│   ├── components/
│   │   └── Sidebar.tsx         # Боковая панель дашборда
│   ├── context/
│   │   └── AppContext.tsx      # Глобальное состояние приложения
│   ├── pages/
│   │   ├── LandingPage.tsx     # Главная страница (лендинг)
│   │   ├── LoginPage.tsx       # Вход/регистрация
│   │   ├── DashboardPage.tsx   # Дашборд пользователя
│   │   ├── EditorPage.tsx      # Конструктор ссылок
│   │   ├── PublicLinkPage.tsx  # Публичная страница ссылки
│   │   ├── StatsPage.tsx       # Статистика
│   │   ├── SettingsPage.tsx    # Настройки профиля
│   │   └── PricingPage.tsx     # Тарифы
│   ├── store/
│   │   └── index.ts            # Хранилище данных (localStorage)
│   ├── types/
│   │   └── index.ts            # TypeScript типы
│   ├── App.tsx                 # Главный компонент с роутингом
│   ├── main.tsx                # Точка входа
│   └── index.css               # Глобальные стили
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🎯 Основные маршруты

- `/` — Главная страница (лендинг)
- `/login` — Вход/регистрация
- `/dashboard` — Дашборд пользователя
- `/dashboard/editor/:id` — Конструктор ссылок
- `/dashboard/stats/:id` — Статистика ссылки
- `/dashboard/settings` — Настройки профиля
- `/pricing` — Тарифы
- `/r/:slug` — Публичная страница ссылки

## 💡 Особенности реализации

### HashRouter
Используется HashRouter для совместимости с GitHub Pages. Все маршруты работают через хэш (#), что позволяет SPA корректно работать на статическом хостинге.

### LocalStorage
Данные хранятся в LocalStorage браузера. В реальном приложении это должно быть заменено на базу данных (PostgreSQL, Supabase и т.д.).

### Адаптивный дизайн
Все страницы полностью адаптивны и оптимизированы для мобильных устройств (Mobile-First).

### Анимации
Плавные микро-анимации, скелетоны загрузки, неоновые эффекты для улучшения UX.

## 🔐 Тарифные планы

### Free (бесплатно)
- До 5 активных ссылок
- Базовая аналитика
- Бейдж "Создано в HyperLink"

### Pro ($9/мес)
- Безлимит ссылок
- Расширенная аналитика
- Без бейджа
- Кастомный домен
- Ретаргетинг пиксели
- Pre-save кампании

## 📝 Лицензия

MIT

## 👨‍💻 Автор

Создано с ❤️ для музыкантов и артистов
