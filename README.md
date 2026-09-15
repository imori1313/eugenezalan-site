# Eugene Zalan

Статический сайт на Astro. Изображения, шрифты и оптимизированные видео находятся в проекте.

## Локальная проверка

Node.js 24.19.0, npm.

```sh
npm ci
npm run build
npm run verify
npm run preview
```

## Cloudflare Pages

- Репозиторий: imori1313/eugenezalan-site
- Ветка: main
- Framework preset: Astro
- Build command: npm run build
- Build output directory: dist
- Root directory: корень репозитория
- NODE_VERSION: 24.19.0
- SSR-адаптер, сервер и база данных не нужны.

Форма создаёт черновик письма, автоматическая отправка пока не подключена.
Тяжёлые оригиналы сохранены отдельно в исходном локальном рабочем проекте.
Команда npm run media предназначена для той рабочей копии с оригиналами и Windows FFmpeg, а не для Cloudflare.
audit/asset-inventory.json необходим компоненту Photo.astro при сборке.
