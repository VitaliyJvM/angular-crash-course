# Angular vs React — cheat sheet

Стисла шпаргалка для повторення та співбесід. Порівнюється Angular 22 із сучасним React (function components + hooks). Жодна з колонок не «краща» — це різні компроміси.

## 1. Framework vs library/ecosystem

| | Angular | React |
|---|---|---|
| Що це | повний framework від однієї команди | UI library + екосистема |
| У поставці | router, forms, HTTP client, DI, i18n, CLI, test setup | рендеринг і стан компонентів |
| Решта стеку | вже обрана | обирає команда: React Router / Next.js, React Hook Form, TanStack Query, Zustand / Redux… |
| Оновлення | синхронні major-релізи двічі на рік, `ng update` з автоматичними migrations | кожна бібліотека оновлюється окремо |

## 2. Архітектура і conventions

| | Angular | React |
|---|---|---|
| Структура проєкту | задана CLI і style guide; проєкти схожі між собою | довільна; залежить від команди чи meta-framework |
| Мова | TypeScript обов'язковий, strict templates | TypeScript типовий, але опційний |
| Розділення відповідальностей | component (view) / service (логіка, дані) / routes / config | components + hooks; шари — за домовленістю |
| Декларативна конфігурація | decorators (`@Component`, `@Service`) і `provide*()` | код і props |

## 3. Component model / templates

| Концепція | Angular | React |
|---|---|---|
| Компонент | клас + `@Component`, створюється один раз | функція, виконується на кожен render |
| View | HTML template, компілюється заздалегідь | JSX — JavaScript-вирази |
| Умова / цикл | `@if` / `@for (…; track id)` | `&&`, тернарний оператор / `.map()` з `key` |
| Вхідні дані | `input()`, `input.required<T>()` | props |
| Події вгору | `output<T>()` + `(event)="…"` | callback props |
| Two-way | `model()` + `[(value)]` | value + onChange вручну |
| Вкладений вміст | `<ng-content>` | `children` |
| Стилі | ізольовані в компоненті за замовчуванням | CSS Modules, CSS-in-JS тощо |
| Перевикористання поведінки на елементі | directives | hooks / HOC / обгортки |
| Трансформація в template | pipes (`| date`) | виклик функції |

Legacy-синтаксис Angular, який трапляється: `*ngIf`, `*ngFor`, `@Input()`, `@Output()` + `EventEmitter`, `[(ngModel)]`.

## 4. Reactivity, state і change detection

| | Angular | React |
|---|---|---|
| Локальний стан | `signal(value)` → `set` / `update` | `useState` |
| Похідний стан | `computed(() => …)` — залежності відстежуються автоматично, результат кешується | `useMemo(fn, deps)` — залежності вручну |
| Side effects | `effect()` — останній засіб; lifecycle hooks; `afterNextRender` | `useEffect` |
| Модель оновлення | fine-grained: оновлюються bindings, що читають змінений signal; default OnPush + zoneless | re-render функції компонента і піддерева, далі reconciliation |
| Оптимізації вручну | рідко потрібні | `memo`, `useMemo`, `useCallback` (або React Compiler) |
| Async-потоки | RxJS `Observable` + `toSignal` / `async` pipe | promises, бібліотеки (TanStack Query) |
| Глобальний стан | services із signals; NgRx / SignalStore за потреби | Context, Zustand, Redux Toolkit |

Історична довідка: до v21 Angular за замовчуванням використовував zone.js і перевіряв усе дерево компонентів після кожної async-події; `ChangeDetectionStrategy.OnPush` вмикали вручну. У v22 OnPush — default, стара стратегія називається `Eager`.

## 5. Dependency injection

| | Angular | React |
|---|---|---|
| Механізм | вбудований ієрархічний DI: `@Service()` / `@Injectable()`, `inject()` | немає DI; Context + hooks, імпорти модулів |
| Scope | application (root), route, component | межі Context Provider |
| Підміна в тестах | `TestBed` providers | mock модулів, обгортки Provider |
| Типові мешканці | data access, state stores, auth, logging | custom hooks, context values |

Для Spring-розробника: service ≈ singleton bean, `inject(X)` ≈ `@Autowired`, `InjectionToken` ≈ qualifier для не-класових значень. Відмінність: injectors утворюють дерево, і scope залежить від того, де оголошено provider.

## 6. Routing / forms / HTTP

| | Angular | React |
|---|---|---|
| Router | `@angular/router`: `Routes`, `<router-outlet>`, `routerLink`, guards, resolvers, lazy `loadComponent` | React Router / TanStack Router / file-based routing в Next.js |
| Route params | `input()` через `withComponentInputBinding()` або `ActivatedRoute` | `useParams()` |
| Навігація з коду | `inject(Router).navigate([...])` | `useNavigate()` |
| Forms | Signal Forms (v22+), Reactive Forms, template-driven — усе вбудоване, з validation | controlled inputs; React Hook Form / Formik + Zod |
| HTTP | `HttpClient` (typed, interceptors, testing utilities), `httpResource` | `fetch` / axios + TanStack Query / SWR |

## 7. Testing і ecosystem

| | Angular | React |
|---|---|---|
| Unit tests | Vitest за замовчуванням із CLI (раніше Karma + Jasmine), `TestBed`, `HttpTestingController` | Vitest / Jest + React Testing Library |
| E2E | Playwright / Cypress (на вибір) | Playwright / Cypress |
| UI kit | Angular Material + CDK (офіційні), PrimeNG | MUI, Ant Design, shadcn/ui, безліч інших |
| SSR | Angular SSR + hydration (вбудовано) | Next.js, Remix / React Router framework mode |
| Mobile | Ionic, NativeScript | React Native |
| Ринок і спільнота | менша, сконцентрована в enterprise | найбільша екосистема та ринок вакансій |

## 8. Learning curve і team scaling

| | Angular | React |
|---|---|---|
| Поріг входу | вищий: DI, decorators, RxJS, templates, CLI | нижчий для старту; складність приходить із вибором стеку |
| Onboarding у новий проєкт | швидкий — структура однакова всюди | залежить від рішень конкретної команди |
| Великі команди | conventions і DI зменшують розбіжності між командами | потрібні власні стандарти й architecture guidelines |
| Гнучкість | менша: «Angular way» | висока: будь-яка архітектура |

## 9. Коли що обирати

**Angular має сенс, коли:**
- великий довгоживучий enterprise-застосунок із багатьма командами та формами;
- важливі однаковість коду, передбачувані оновлення і мінімум рішень про стек;
- команда прийшла з Java/C# — DI, класи й шари їй знайомі.

**React має сенс, коли:**
- потрібна максимальна гнучкість або специфічний стек (Next.js, React Native, вбудовування у наявну сторінку);
- невеликий продукт чи команда, швидкі експерименти;
- важливий найширший вибір бібліотек і кандидатів.

**Обидва в одній організації** — нормальна ситуація: різні продукти з різними вимогами, micro-frontends, спільний TypeScript-код і design tokens. Для розробника знання обох — перевага: концепції (components, однонаправлений потік даних, derived state) спільні, відрізняються механізми.

**Чого не варто казати на співбесіді:** «X завжди кращий/швидший за Y». Продуктивність обох достатня для більшості застосунків; вирішують команда, вимоги та вартість підтримки.
