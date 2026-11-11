# Day 5 · Lesson 5 — Angular vs React: decision guide

**Estimated time:** 5 хв · **Time budget:** read 2 · guided activity 1 · try 2
**Learning outcome:** аргументовано, без «X завжди кращий», відповісти англійською, коли обрати Angular, React або обидва.

[← Попередній: Accessibility та security basics](04-accessibility-and-security.md) · [План курсу](../../COURSE-PLAN.md) · [Наступний: Final challenge: видалення посилки →](06-final-challenge.md)

## Why it matters

«Angular or React — and why?» ставлять майже на кожній співбесіді розробнику з досвідом в обох. Оцінюють не вибір, а вміння назвати критерії та trade-offs.

## Concept

Обидва інструменти будують ті самі продукти. Різниця — **хто приймає архітектурні рішення**: Angular (framework із вбудованими router, forms, HTTP, DI, testing setup) чи команда (React як UI library + обрана екосистема).

| Критерій | Схиляє до Angular | Схиляє до React |
| --- | --- | --- |
| Розмір команди, однорідність коду | багато команд / ротація людей: однакові conventions «з коробки» | мала сильна команда, яка сама тримає conventions |
| Router / forms / HTTP / DI | потрібне одне офіційне, узгоджене рішення | хочете обирати бібліотеки під задачу (TanStack, RHF, Zustand…) |
| Екосистема, найм | enterprise, банки, держсектор; Java/.NET-команди (DI, типізація знайомі) | найбільший ринок кандидатів і бібліотек, стартапи |
| Гнучкість | менша: «Angular way», зате передбачувані оновлення (`ng update`) | більша: легко вбудувати в існуючу сторінку чи нестандартний стек |
| SSR / meta-framework | Angular SSR + hydration — частина фреймворку | Next.js / Remix — зріла, але окрема архітектурна ставка |
| Mobile | Ionic / NativeScript (нішево) | React Native — вагомий аргумент за спільні навички |
| Довгоживучий enterprise-застосунок | сильна сторона: LTS, міграції schematics, строгі типи у templates | можливо, але дисципліну забезпечує команда, а не інструмент |
| Micro-frontends / обидва | різні команди можуть мати різні стеки; контракт — custom elements або Module Federation; ціна — розмір bundle і складність |

Аналогія зі світу backend (неповна): Angular ≈ Spring Boot (opinionated, batteries included), React ≈ набір бібліотек, з яких ви складаєте власний стек.

Чого **не** варто казати: «Angular повільніший», «React не для enterprise». Із Signals і zoneless модель реактивності Angular близька за ефективністю; великі enterprise-системи є на обох.

Повна шпаргалка за категоріями: [reference/angular-vs-react.md](../reference/angular-vs-react.md).

## Follow along

1. Прочитайте таблицю й позначте для себе 3 критерії, які були вирішальними у ваших реальних проєктах.
2. Для кожного сформулюйте одне речення-trade-off за шаблоном: *«Angular gives us …, at the cost of …»* / *«React gives us …, at the cost of …»*.
3. Відкрийте [angular-vs-react.md](../reference/angular-vs-react.md) і знайдіть один пункт, який можете підкріпити кодом із ParcelFlow Lite (наприклад, DI: `ShipmentStore` vs Context + hooks).

## Try it yourself

Увімкніть таймер на 60 секунд і вголос англійською дайте відповідь на питання: **"When would you choose Angular over React?"**

Вимоги до відповіді: 2–3 критерії, один чесний недолік Angular, одне речення про те, коли обрали б React. Без готового тексту перед очима.

Hint: структура «context → criteria → trade-off → counter-case».

## Verify / Expected result

- Відповідь вклалась у 60 секунд і не містила слів *always / never / better* без уточнення «for …».
- Ви назвали щонайменше один trade-off для кожної сторони.
- Після спроби порівняйте з модельною відповіддю в Interview checkpoint нижче.

## Common mistake / Best practice

**Пастка:** відповідати на «Angular vs React» особистими вподобаннями («мені більше подобається JSX»). Наслідок: інтерв'юер бачить відсутність архітектурного мислення. **Правильно:** почати з контексту (команда, термін життя продукту, наявна експертиза, вимоги до SSR/mobile) і лише тоді назвати вибір та його ціну.

## Interview checkpoint

**Q: When would you choose Angular over React?**
A: When several teams work on a long-lived application and consistency matters more than flexibility. Angular ships routing, forms, HTTP, DI and testing as one coherent, strongly typed platform with predictable upgrades, so teams don't spend time choosing and aligning libraries. The cost is a steeper learning curve and less freedom. For a small team, a content-heavy site with Next.js, or a product that shares code with React Native, I would lean towards React.

**Q: Can Angular and React coexist in one product?**
A: Yes, usually through micro-frontends or web components with a clear contract between them. It is a valid migration or organizational strategy, but it costs bundle size and operational complexity, so I would not choose it by default.

## Done when

- [ ] Можете назвати 4 критерії вибору з таблиці без підглядання.
- [ ] Дали 60-секундну відповідь англійською вголос.
- [ ] Маєте один приклад із ParcelFlow Lite, що ілюструє відмінність підходів.

---

Docs: [What is Angular?](https://angular.dev/overview) · [Angular roadmap](https://angular.dev/roadmap)

[← Попередній: Accessibility та security basics](04-accessibility-and-security.md) · [Наступний: Final challenge: видалення посилки →](06-final-challenge.md)
