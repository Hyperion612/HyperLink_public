# 🚀 Деплой на GitHub Pages

## ✅ Проблема решена - 404 ошибка исправлена!

### Что было исправлено:

1. **Обновлён `public/404.html`**
   - Упрощён скрипт редиректа для HashRouter
   - Автоматически перенаправляет все 404 на `index.html`
   - Сохраняет путь в hash для корректной работы роутинга

2. **Конфигурация Vite**
   - `base: './'` — относительные пути для всех ассетов
   - Работает с любым именем репозитория

## 📋 Пошаговая инструкция по деплою

### Шаг 1: Создайте репозиторий на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите **"New repository"**
3. Заполните:
   - **Repository name**: `hyperlink` (или любое другое имя)
   - **Description**: "HyperLink - умные ссылки для музыкантов"
   - **Public**: ✅ выберите Public
   - **Initialize**: НЕ выбирайте README, .gitignore, license
4. Нажмите **"Create repository"**

### Шаг 2: Запушьте код

```bash
# Инициализация git (если ещё не сделано)
git init

# Добавьте все файлы
git add .

# Создайте первый коммит
git commit -m "Initial commit: HyperLink SaaS"

# Добавьте удалённый репозиторий (замените USERNAME и REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Запушьте в main ветку
git branch -M main
git push -u origin main
```

### Шаг 3: Настройте GitHub Pages

1. Перейдите в ваш репозиторий на GitHub
2. Нажмите **Settings** (вверху справа)
3. В боковом меню выберите **Pages**
4. В разделе **Source**:
   - Выберите **"GitHub Actions"** (НЕ "Deploy from a branch")
5. GitHub автоматически найдёт workflow в `.github/workflows/deploy.yml`

### Шаг 4: Дождитесь деплоя

1. Перейдите во вкладку **Actions**
2. Вы увидите запущенный workflow "Deploy to GitHub Pages"
3. Дождитесь успешного завершения (~2-3 минуты)
4. Когда workflow завершится, появится зелёная галочка ✅

### Шаг 5: Откройте сайт

Ваш сайт будет доступен по адресу:
```
https://USERNAME.github.io/REPO/
```

Например:
- Если ваш username: `johndoe`
- Имя репозитория: `hyperlink`
- URL: `https://johndoe.github.io/hyperlink/`

## 🔍 Проверка работы

### 1. Главная страница
Откройте `https://USERNAME.github.io/REPO/`
Должна загрузиться главная страница HyperLink

### 2. Навигация
Нажмите на кнопки:
- "Создать ссылку бесплатно" → `/login`
- "Тарифы" → `/pricing`
- "Для разработчиков" → `/connect`

Все страницы должны открываться корректно

### 3. Прямые ссылки
Попробуйте открыть прямые ссылки:
- `https://USERNAME.github.io/REPO/#/login`
- `https://USERNAME.github.io/REPO/#/dashboard`
- `https://USERNAME.github.io/REPO/#/pricing`

Все должны работать благодаря HashRouter

### 4. Демо-вход
Войдите с демо-аккаунтом:
- **Email**: `demo@hyperlink.app`
- **Пароль**: `demo`

## 🐛 Если всё ещё 404

### Проблема: 404 при открытии главной

**Решение:**
1. Проверьте, что workflow завершился успешно
2. Убедитесь, что в Settings → Pages выбран "GitHub Actions"
3. Проверьте URL: должен быть `https://USERNAME.github.io/REPO/`

### Проблема: 404 при переходе по ссылкам

**Решение:**
1. Убедитесь, что используется HashRouter (проверьте URL — должен быть `/#/route`)
2. Очистите кэш браузера: `Ctrl+Shift+R`
3. Проверьте консоль на ошибки (F12)

### Проблема: Стили не загружаются

**Решение:**
1. Проверьте, что в `vite.config.js` установлено `base: './'`
2. Пересоберите проект: `npm run build`
3. Запушьте изменения

### Проблема: Белый экран

**Решение:**
1. Откройте DevTools (F12) → Console
2. Проверьте на наличие ошибок
3. Убедитесь, что все файлы загрузились (Network tab)

## 📊 Структура деплоя

```
.github/
└── workflows/
    └── deploy.yml          # GitHub Actions workflow

public/
└── 404.html                # Обработка 404 для SPA

dist/                       # Создаётся при сборке
├── index.html
├── 404.html
└── assets/
    ├── *.js
    └── *.css
```

## 🔄 Обновление сайта

После внесения изменений:

```bash
# Закоммитьте изменения
git add .
git commit -m "Update: описание изменений"

# Запушьте
git push
```

GitHub Actions автоматически пересоберёт и задеплоит сайт (~2-3 минуты)

## 💡 Советы

### 1. Кастомный домен (опционально)

Если хотите использовать свой домен (например, `hyperlink.com`):

1. В Settings → Pages → Custom domain
2. Введите ваш домен
3. Настройте DNS у вашего регистратора:
   - A records на GitHub IPs
   - Или CNAME на `USERNAME.github.io`

### 2. Кэширование

GitHub Pages кэширует файлы. Если изменения не применяются:
- Добавьте версионирование в URL ассетов
- Используйте `Ctrl+Shift+R` для жёсткой перезагрузки

### 3. Мониторинг

- Проверяйте вкладку **Actions** для статуса деплоя
- Используйте **Environments** → **github-pages** для просмотра URL
- Проверяйте **Deployments** для истории деплоев

### 4. Локальное тестирование

Перед деплоем тестируйте локально:

```bash
# Сборка
npm run build

# Запуск локального сервера
npx serve dist

# Откройте http://localhost:3000
```

## 📚 Полезные ссылки

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)
- [SPA on GitHub Pages](https://github.com/rafgraph/spa-github-pages)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

## 🎯 Чек-лист перед деплоем

- [ ] Код запушен в репозиторий
- [ ] Workflow файл существует (`.github/workflows/deploy.yml`)
- [ ] 404.html добавлен в `public/`
- [ ] Vite настроен с `base: './'`
- [ ] В Settings → Pages выбран "GitHub Actions"
- [ ] Workflow завершился успешно
- [ ] Сайт открывается по URL
- [ ] Все страницы работают
- [ ] Навигация работает
- [ ] Демо-вход работает

---

**Готово!** Ваш HyperLink успешно задеплоен на GitHub Pages! 🎉

Если возникнут проблемы, проверьте раздел "Решение проблем" выше или создайте issue в репозитории.
