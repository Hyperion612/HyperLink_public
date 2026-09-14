# 🚀 Как запустить HyperLink

## ❗ Важная информация

Ошибка `main.tsx:1 Failed to load resource: 404` возникает потому что вы открываете `index.html` напрямую через `file://` протокол. Браузеры блокируют загрузку модулей из файловой системы по соображениям безопасности.

## ✅ Правильные способы запуска

### Способ 1: Dev-сервер (для разработки)

```bash
# 1. Установите зависимости (если ещё не установлены)
npm install

# 2. Запустите dev-сервер
npm run dev

# 3. Откройте в браузере:
http://localhost:3000
```

### Способ 2: Production сборка + HTTP-сервер

```bash
# 1. Соберите проект
npm run build

# 2. Запустите HTTP-сервер для папки dist
npx serve dist

# 3. Откройте в браузере URL который покажет сервер
# Обычно: http://localhost:3000
```

### Способ 3: Python HTTP-сервер (если есть Python)

```bash
# 1. Соберите проект
npm run build

# 2. Перейдите в папку dist
cd dist

# 3. Запустите Python HTTP-сервер
python -m http.server 3000

# 4. Откройте в браузере:
http://localhost:3000
```

## 🔍 Проверка

После запуска откройте DevTools (F12) → Console. Вы должны увидеть:

```
✅ App initialized successfully
✅ Current user loaded: demo@hyperlink.app
✅ User links loaded: 3
```

## 📋 Демо-доступ

- **Email:** `demo@hyperlink.app`
- **Пароль:** `demo`

## 🐛 Если всё ещё не работает

1. **Очистите кэш браузера:** Ctrl+Shift+R (Windows) или Cmd+Shift+R (Mac)
2. **Очистите localStorage:** Откройте DevTools → Application → Local Storage → Clear All
3. **Проверьте консоль:** F12 → Console → скопируйте ошибки
4. **Проверьте Network:** F12 → Network → убедитесь что все файлы загружаются (статус 200)

## 📦 Структура проекта

```
hyperlink/
├── src/                    # Исходный код
│   ├── App.tsx            # Главный компонент
│   ├── main.tsx           # Точка входа
│   ├── index.css          # Стили
│   ├── context/           # React контекст
│   ├── pages/             # Страницы
│   ├── components/        # Компоненты
│   ├── store/             # Хранилище данных
│   └── types/             # TypeScript типы
├── dist/                   # Production сборка
├── index.html             # HTML шаблон
├── package.json           # Зависимости
└── vite.config.js         # Конфигурация Vite
```

## 🌐 Деплой на GitHub Pages

Проект уже настроен для деплоя на GitHub Pages через GitHub Actions.

```bash
# 1. Создайте репозиторий на GitHub
# 2. Запушьте код
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# 3. В GitHub: Settings → Pages → Source: GitHub Actions
# 4. Дождитесь завершения workflow
# 5. Откройте: https://USERNAME.github.io/REPO/
```

## 💡 Почему нельзя открывать через file://?

Браузеры блокируют загрузку ES6 модулей из файловой системы по соображениям безопасности (CORS policy). Это стандартное поведение для всех современных браузеров.

Решение: всегда используйте HTTP-сервер для запуска веб-приложений.
