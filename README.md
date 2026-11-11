# Angular Crash Course for Experienced Developers

Практичний курс на **5 днів × 60 хвилин** для розробника, який уже знає TypeScript, React і Spring Boot та системно входить в Angular. Дві рівноцінні цілі:

1. практична база Angular 22 (standalone components, signals, DI, HttpClient, Router, Signal Forms, Vitest);
2. підготовка до типових Angular technical interview questions (відповіді — англійською).

Навчальний проєкт — **ParcelFlow Lite**: невеликий застосунок для відстеження посилок без backend.

## Prerequisites

| Що | Версія | Перевірка |
|----|--------|-----------|
| Node.js | `^22.22.3`, `^24.15.0` або `>=26` | `node -v` |
| npm | 8+ (перевірено на 11) | `npm -v` |
| Angular CLI | 22.x — глобальна установка не потрібна, використовується `npx` | — |
| Редактор | будь-який; для VS Code / WebStorm увімкни Angular Language Service | — |

Знання, які курс **не** пояснює: JavaScript/TypeScript, HTML/CSS, Git, HTTP, async/await, ООП.

## Структура репозиторію

```
├── README.md            ← ти тут
├── COURSE-PLAN.md       ← усі уроки, тривалість, перевірка часу
├── PROGRESS.md          ← checklist проходження
├── docs/
│   ├── day-01-fundamentals/ … day-05-quality-interview/   ← уроки
│   └── reference/       ← шпаргалки та interview questions
├── exercises/solutions/ ← розв'язки вправ (не читати наперед)
├── app/                 ← еталонна реалізація ParcelFlow Lite (фінальний стан)
└── practice/            ← ТВІЙ workspace, який ти створюєш на Day 1 (ще не існує)
```

### `app/` і `practice/` — чому два workspace

Курс вимагає, щоб ти створив проєкт **з нуля**, і водночас щоб у репозиторії був **робочий перевірений код**. Тому:

- `practice/` — твій власний Angular workspace. Ти створюєш його командою `ng new` в уроці 1.2 і розвиваєш від уроку до уроку.
- `app/` — еталон: стан проєкту після Day 5 **без final challenge**. Користуйся ним, щоб звірити свій код, скопіювати JSON fixture або запустити готовий застосунок. Не редагуй його під час навчання.

## Швидкий старт

Запустити еталонний застосунок:

```bash
cd app
npm install
npm start          # ng serve → http://localhost:4200
```

Інші команди (з `app/` або з твого `practice/`):

```bash
npx ng test --no-watch     # unit tests (Vitest + jsdom), одноразовий запуск
npx ng test                # unit tests у watch mode
npx ng build               # production build у dist/
```

Почати навчання: відкрий [Day 1 · Lesson 1](docs/day-01-fundamentals/01-angular-vs-react-mental-model.md).

## Порядок проходження

1. Переглянь [COURSE-PLAN.md](COURSE-PLAN.md) — 30 уроків, 300 хвилин.
2. Щодня проходь один модуль `docs/day-0N-*/` по порядку: кожен урок має посилання «попередній / наступний».
3. У кожному уроці: **Concept → Follow along → Try it yourself → Verify → Interview checkpoint**. Відповіді на interview questions проговорюй уголос англійською.
4. Відмічай прогрес у [PROGRESS.md](PROGRESS.md).
5. Блоки коду у **Follow along** розраховані на copy-paste: хронометраж не передбачає ручного набору всього коду. Набирай вручну лише те, що хочеш запам'ятати.
6. Тримай таймер. Якщо урок не вкладається в час — зафіксуй, де зупинився, і рухайся далі; уроки наступного дня стартують зі стану, який можна звірити з `app/`.

Довідкові матеріали (не входять у хронометраж, для повторення перед співбесідою):

- [Angular vs React cheat sheet](docs/reference/angular-vs-react.md)
- [Angular cheat sheet](docs/reference/angular-cheatsheet.md)
- [Project structure](docs/reference/project-structure.md)
- [Interview questions](docs/reference/interview-questions.md)

## Правила роботи з рішеннями

- Блок **Try it yourself** спершу виконуй сам. Підказки (hints) є в уроці, відповіді — ні.
- `exercises/solutions/day-0N.md` відкривай лише після власної спроби (або якщо застряг довше ніж на 3–4 хвилини — час курсу обмежений).
- `exercises/solutions/final-challenge.md` — тільки після уроку 5.6.
- `app/` містить результат усіх **Follow along** кроків, але не містить результатів Try it yourself та final challenge.

## Чесно про обмеження

- **Backend немає.** `public/data/shipments.json` — статичний файл, який віддає dev server. HTTP GET працює; POST/PUT/DELETE нічого не зберігають.
- Створення посилки та «Mark delivered» змінюють лише стан у пам'яті браузера і **зникають після оновлення сторінки**.
- Проміжні стани проєкту (кінець Day 1–4) збиралися через `ng build` під час створення курсу; фінальний стан перевірено build + tests. Деталі — у розділі «Verification» наприкінці [PROGRESS.md](PROGRESS.md).

## Технічна база

Angular 22.2 · Angular CLI 22.2.6 · TypeScript 6.0 · RxJS 7.8 · Vitest 5 + jsdom · без UI-бібліотек і додаткових залежностей. Сумісність версій: <https://angular.dev/reference/versions>.
