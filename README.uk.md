# Angular Crash Course for Experienced Developers

[English](README.md) | **Українська**

Практичний курс з Angular 22 для розробників, які вже пишуть код професійно: **5 днів по 60 хвилин, 30 коротких уроків**. Ти з нуля створюєш невеликий застосунок для відстеження посилок і водночас готуєшся до типових запитань на Angular technical interviews.

Курс доступний англійською та українською з однаковим змістом. Обидві версії використовують один спільний Angular-застосунок.

## Для кого цей курс

Для розробників, які впевнено працюють із TypeScript і мають досвід із React або з backend-стеком на кшталт Java та Spring Boot, а тепер потребують системного й швидкого входження в Angular.

Курс **не** пояснює JavaScript і TypeScript, HTML і CSS, Git, HTTP, `async`/`await` та ООП. Натомість нові концепції Angular зіставляються з тим, що ти вже знаєш: JSX і Angular templates, props та `input()`, hooks і signals, React context та Angular services, Spring beans та Angular dependency injection.

### Prerequisites (передумови)

| Що | Версія | Перевірка |
|----|--------|-----------|
| Node.js | `^22.22.3`, `^24.15.0` або `>=26` | `node -v` |
| npm | 8+ (перевірено на 11) | `npm -v` |
| Angular CLI | 22.x — глобальна установка не потрібна, використовується `npx` | — |
| Редактор | будь-який; для VS Code / WebStorm увімкни Angular Language Service | — |

## Чого ти навчишся

Після п'яти годин ти зможеш:

- пояснити архітектуру Angular і її відмінності від React;
- створити workspace через Angular CLI та орієнтуватися в його файлах;
- будувати standalone components із templates, `@if` / `@for`, `input()` та `output()`;
- керувати станом через `signal()` і `computed()`, пояснити change detection, OnPush та zoneless;
- виносити логіку в services, користуватися `inject()` і розуміти provider scopes;
- завантажувати типізовані дані через `HttpClient` та обробляти стани loading, error і empty;
- розрізняти, коли використовувати signals, а коли RxJS, і безпечно поєднувати їх;
- додавати маршрути, route parameters і lazy loading через Angular Router;
- будувати форму з валідацією на Signal Forms та пояснити Reactive і template-driven forms;
- писати unit tests для service і component з Vitest та `TestBed`;
- відповідати вголос на типові interview questions з Angular.

## Структура курсу

Кожен день — один модуль рівно на 60 хвилин. Уроки тривають 5, 10 або 15 хвилин, і цей час включає читання, введення коду, вправу та перевірку.

| День | Модуль | Уроків | Хвилин |
|------|--------|--------|--------|
| 1 | Angular Fundamentals & Project Structure | 6 | 60 |
| 2 | Components, Templates & State | 6 | 60 |
| 3 | Services, DI & Data Loading | 6 | 60 |
| 4 | Router & Forms | 5 | 60 |
| 5 | Quality, Best Practices & Interview | 7 | 60 |
| | **Разом** | **30** | **300** |

Кожен урок має однаковий шаблон: **Why it matters → Concept → Follow along → Try it yourself → Verify → Common mistake → Interview checkpoint → Done when**.

Повний план із тривалістю та результатами — у [docs/uk/COURSE-PLAN.md](docs/uk/COURSE-PLAN.md).

## Усі 30 уроків

### Day 1 — Angular Fundamentals & Project Structure

| # | Урок | Хв |
|---|------|----|
| 1.1 | [Angular vs React: mental model](docs/uk/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md) | 5 |
| 1.2 | [Angular CLI та створення workspace](docs/uk/lessons/day-01-fundamentals/02-cli-and-workspace-setup.md) | 15 |
| 1.3 | [Тур по workspace: від `angular.json` до `App`](docs/uk/lessons/day-01-fundamentals/03-workspace-tour.md) | 10 |
| 1.4 | [Перший компонент: `ShipmentList`](docs/uk/lessons/day-01-fundamentals/04-first-component.md) | 15 |
| 1.5 | [Template bindings](docs/uk/lessons/day-01-fundamentals/05-template-bindings.md) | 10 |
| 1.6 | [NgModules vs Standalone](docs/uk/lessons/day-01-fundamentals/06-ngmodules-vs-standalone.md) | 5 |

### Day 2 — Components, Templates & State

| # | Урок | Хв |
|---|------|----|
| 2.1 | [Typed model, `@for` та `@if`](docs/uk/lessons/day-02-components-state/01-typed-model-and-control-flow.md) | 10 |
| 2.2 | [`signal()` та події: статус-фільтр](docs/uk/lessons/day-02-components-state/02-signals-and-events.md) | 10 |
| 2.3 | [`computed()`: похідний стан і лічильники](docs/uk/lessons/day-02-components-state/03-computed-derived-state.md) | 10 |
| 2.4 | [`input()`: компонент `ShipmentCard`](docs/uk/lessons/day-02-components-state/04-input-child-component.md) | 10 |
| 2.5 | [`output()`: подія від child до parent](docs/uk/lessons/day-02-components-state/05-output-child-to-parent.md) | 10 |
| 2.6 | [Lifecycle, change detection, OnPush і zoneless](docs/uk/lessons/day-02-components-state/06-lifecycle-and-change-detection.md) | 10 |

### Day 3 — Services, DI & Data Loading

| # | Урок | Хв |
|---|------|----|
| 3.1 | [Services та `inject()`: `ShipmentStore`](docs/uk/lessons/day-03-services-http/01-services-and-inject.md) | 10 |
| 3.2 | [DI: provider scopes і порівняння зі Spring](docs/uk/lessons/day-03-services-http/02-di-scopes-vs-spring.md) | 5 |
| 3.3 | [`HttpClient`: GET із JSON fixture](docs/uk/lessons/day-03-services-http/03-httpclient-get-fixture.md) | 15 |
| 3.4 | [Loading / error / empty states](docs/uk/lessons/day-03-services-http/04-loading-error-empty-states.md) | 10 |
| 3.5 | [Observable basics і безпечні subscriptions: пошук із debounce](docs/uk/lessons/day-03-services-http/05-observables-and-interop.md) | 15 |
| 3.6 | [Signals vs RxJS: що коли обирати](docs/uk/lessons/day-03-services-http/06-signals-vs-rxjs.md) | 5 |

### Day 4 — Router & Forms

| # | Урок | Хв |
|---|------|----|
| 4.1 | [Routes та навігація](docs/uk/lessons/day-04-routing-forms/01-routes-and-navigation.md) | 10 |
| 4.2 | [Route parameters: сторінка `ShipmentDetails`](docs/uk/lessons/day-04-routing-forms/02-route-params-details.md) | 15 |
| 4.3 | [Signal Forms: форма створення посилки](docs/uk/lessons/day-04-routing-forms/03-signal-forms-basics.md) | 15 |
| 4.4 | [Validation, повідомлення про помилки та submit](docs/uk/lessons/day-04-routing-forms/04-validation-and-submit.md) | 10 |
| 4.5 | [Signal Forms vs Reactive Forms vs template-driven](docs/uk/lessons/day-04-routing-forms/05-forms-comparison-reactive.md) | 10 |

### Day 5 — Quality, Best Practices & Interview

| # | Урок | Хв |
|---|------|----|
| 5.1 | [Unit test сервісу: `ShipmentStore`](docs/uk/lessons/day-05-quality-interview/01-testing-a-service.md) | 10 |
| 5.2 | [Unit test компонента: `ShipmentCard`](docs/uk/lessons/day-05-quality-interview/02-testing-a-component.md) | 10 |
| 5.3 | [Production structure та common mistakes](docs/uk/lessons/day-05-quality-interview/03-production-structure-and-mistakes.md) | 5 |
| 5.4 | [Accessibility та security basics](docs/uk/lessons/day-05-quality-interview/04-accessibility-and-security.md) | 5 |
| 5.5 | [Angular vs React: decision guide](docs/uk/lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md) | 5 |
| 5.6 | [Final challenge: видалення посилки](docs/uk/lessons/day-05-quality-interview/06-final-challenge.md) | 15 |
| 5.7 | [Interview review](docs/uk/lessons/day-05-quality-interview/07-interview-review.md) | 10 |

## Навчальний застосунок: ParcelFlow Lite

ParcelFlow Lite — невеликий застосунок для відстеження посилок без backend. До кінця курсу в ньому є:

- список посилок, який завантажується через HTTP з локального JSON fixture, зі станами loading, error та empty;
- статус-фільтр, пошук за tracking number із debounce та похідні лічильники;
- сторінка деталей кожної посилки з tracking events;
- форма, що створює посилку в пам'яті, з валідацією required, pattern та перевіркою дублікатів;
- unit tests для store, компонента картки та форми.

Доменна модель навмисно мінімальна: `Shipment` (`id`, `trackingNumber`, `carrier`, `status`, `createdAt`) і `TrackingEvent`.

## Структура репозиторію

```
├── README.md              ← англійська версія (основна)
├── README.uk.md           ← ти тут
├── docs/
│   ├── en/                ← курс англійською (та сама структура)
│   └── uk/
│       ├── COURSE-PLAN.md ← усі уроки, тривалість, перевірка часу
│       ├── PROGRESS.md    ← checklist проходження
│       ├── lessons/       ← day-01-fundamentals/ … day-05-quality-interview/
│       └── reference/     ← шпаргалки та interview questions
├── exercises/solutions/
│   ├── en/                ← розв'язки англійською
│   └── uk/                ← розв'язки вправ (не читати наперед)
├── app/                   ← еталонна реалізація ParcelFlow Lite (фінальний стан), спільна для обох мов
└── practice/              ← ТВІЙ workspace, який ти створюєш на Day 1 (не входить у репозиторій)
```

Курс доступний двома мовами з однаковим змістом; код застосунку один. У кожному уроці вгорі є перемикач мови.

### `app/` і `practice/` — чому два workspace

Курс вимагає, щоб ти створив проєкт **з нуля**, і водночас щоб у репозиторії був **робочий перевірений код**. Тому:

- `practice/` — твій власний Angular workspace. Ти створюєш його командою `ng new` в уроці 1.2 і розвиваєш від уроку до уроку. Тека додана в `.gitignore`.
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

Почати навчання: відкрий [Day 1 · Lesson 1](docs/uk/lessons/day-01-fundamentals/01-angular-vs-react-mental-model.md).

## Порядок проходження

1. Переглянь [COURSE-PLAN.md](docs/uk/COURSE-PLAN.md) — 30 уроків, 300 хвилин.
2. Щодня проходь один модуль `docs/uk/lessons/day-0N-*/` по порядку: кожен урок має посилання «попередній / наступний» і на той самий урок іншою мовою.
3. У кожному уроці: **Concept → Follow along → Try it yourself → Verify → Interview checkpoint**. Відповіді на interview questions проговорюй уголос англійською.
4. Відмічай прогрес у [PROGRESS.md](docs/uk/PROGRESS.md).
5. Блоки коду у **Follow along** розраховані на copy-paste: хронометраж не передбачає ручного набору всього коду. Набирай вручну лише те, що хочеш запам'ятати.
6. Тримай таймер. Якщо урок не вкладається в час — зафіксуй, де зупинився, і рухайся далі; уроки наступного дня стартують зі стану, який можна звірити з `app/`.

### Вправи та розв'язки

- Блок **Try it yourself** спершу виконуй сам. Підказки (hints) є в уроці, відповіді — ні.
- `exercises/solutions/uk/day-0N.md` відкривай лише після власної спроби (або якщо застряг довше ніж на 3–4 хвилини — час курсу обмежений).
- `exercises/solutions/uk/final-challenge.md` — тільки після уроку 5.6.
- `app/` містить результат усіх **Follow along** кроків, але не містить результатів Try it yourself та final challenge.

## Технічна база

Angular 22.2 · Angular CLI 22.2 · TypeScript 6.0 · RxJS 7.8 · Vitest 5 + jsdom · без UI-бібліотек і додаткових залежностей, окрім тих, що встановлює `ng new`.

Курс використовує поточний рекомендований стиль: standalone components, `inject()`, signals, вбудований control flow, `@Service()`, Signal Forms, zoneless change detection. Старіші патерни, які трапляються в наявних codebases (NgModules, `*ngIf`, `@Input()`, `@Injectable({ providedIn: 'root' })`, zone.js, Reactive Forms), пояснено там, де вони важливі для читання legacy-коду та для співбесід. Підтримувані комбінації версій: <https://angular.dev/reference/versions>.

## Підготовка до співбесід

- Кожен урок завершується блоком **Interview checkpoint**: одне-два запитання з короткою відповіддю, яку можна сказати вголос.
- [Interview questions](docs/uk/reference/interview-questions.md): 40 запитань зі стислими відповідями за темами.
- [Angular vs React cheat sheet](docs/uk/reference/angular-vs-react.md): порівняння та поради, коли що обирати.
- [Angular cheat sheet](docs/uk/reference/angular-cheatsheet.md): синтаксис і API, що використовуються в курсі.
- [Project structure](docs/uk/reference/project-structure.md): структура застосунку та відповідальність кожної частини.
- [Урок 5.7](docs/uk/lessons/day-05-quality-interview/07-interview-review.md): швидке опитування (rapid-fire) і таблиця самооцінки в [PROGRESS.md](docs/uk/PROGRESS.md).

## Чесно про обмеження

- **Backend немає.** `public/data/shipments.json` — статичний файл, який віддає dev server. HTTP GET працює; POST/PUT/DELETE нічого не зберігають.
- Створення посилки та «Mark delivered» змінюють лише стан у пам'яті браузера і **зникають після оновлення сторінки**.
- П'яти годин вистачає на робочу базу, але не на глибину. NgRx, SSR, автентифікація, route guards, поглиблений RxJS, Docker і CI/CD виходять за межі курсу й винесені в наступні кроки.
- Курс орієнтований на Angular 22. Вивід CLI та рекомендовані API змінюються між major-версіями, тому новіші версії можуть генерувати інші файли.
- Еталонний застосунок перевірено production build і unit tests у jsdom. Стани на кінець кожного дня збиралися, але стани після окремих уроків — ні, і більшість розв'язків Try it yourself окремо не компілювалася. Розділ «Verification» у [PROGRESS.md](docs/uk/PROGRESS.md) точно описує, що перевірялося, а що ні.

## Посилання

- [План курсу](docs/uk/COURSE-PLAN.md) · [Checklist прогресу](docs/uk/PROGRESS.md)
- Уроки: [Day 1](docs/uk/lessons/day-01-fundamentals/) · [Day 2](docs/uk/lessons/day-02-components-state/) · [Day 3](docs/uk/lessons/day-03-services-http/) · [Day 4](docs/uk/lessons/day-04-routing-forms/) · [Day 5](docs/uk/lessons/day-05-quality-interview/)
- [Довідкові матеріали](docs/uk/reference/) · [Розв'язки](exercises/solutions/uk/README.md)
- [English version](README.md)
