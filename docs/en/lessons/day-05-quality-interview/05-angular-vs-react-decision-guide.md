# Day 5 · Lesson 5 — Angular vs React: decision guide

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/05-angular-vs-react-decision-guide.md)

**Estimated time:** 5 min · **Time budget:** read 2 · guided activity 1 · try 2

**Learning outcome:** give a reasoned answer, without "X is always better", to when you would choose Angular, React or both.

[← Previous: Accessibility and security basics](04-accessibility-and-security.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Final challenge: deleting a shipment →](06-final-challenge.md)

## Why it matters

"Angular or React — and why?" is asked in almost every interview with a developer who has experience in both. What is assessed is not the choice but the ability to name the criteria and trade-offs.

## Concept

Both tools build the same products. The difference is **who makes the architectural decisions**: Angular (a framework with a built-in router, forms, HTTP, DI and testing setup) or the team (React as a UI library + a chosen ecosystem).

| Criterion | Leans towards Angular | Leans towards React |
| --- | --- | --- |
| Team size, code uniformity | many teams / people rotating: the same conventions out of the box | a small, strong team that maintains its own conventions |
| Router / forms / HTTP / DI | you need one official, consistent solution | you want to pick libraries for the task (TanStack, RHF, Zustand…) |
| Ecosystem, hiring | enterprise, banks, public sector; Java/.NET teams (DI and typing are familiar) | the largest market of candidates and libraries, startups |
| Flexibility | less: the "Angular way", but predictable upgrades (`ng update`) | more: easy to embed into an existing page or a non-standard stack |
| SSR / meta-framework | Angular SSR + hydration is part of the framework | Next.js / Remix — mature, but a separate architectural bet |
| Mobile | Ionic / NativeScript (niche) | React Native — a strong argument for shared skills |
| Long-lived enterprise application | a strength: LTS, schematics migrations, strict types in templates | possible, but the discipline comes from the team, not the tool |
| Micro-frontends / both | different teams can have different stacks; the contract is custom elements or Module Federation; the price is bundle size and complexity | the same applies |

An analogy from the backend world (incomplete): Angular ≈ Spring Boot (opinionated, batteries included), React ≈ a set of libraries from which you assemble your own stack.

What you should **not** say: "Angular is slower", "React is not for enterprise". With Signals and zoneless, Angular's reactivity model is close in efficiency; large enterprise systems exist on both.

The full cheat sheet by category: [reference/angular-vs-react.md](../../reference/angular-vs-react.md).

## Follow along

1. Read the table and mark for yourself the 3 criteria that were decisive in your real projects.
2. For each one, formulate a single trade-off sentence using the template: *"Angular gives us …, at the cost of …"* / *"React gives us …, at the cost of …"*.
3. Open [angular-vs-react.md](../../reference/angular-vs-react.md) and find one item you can back up with code from ParcelFlow Lite (for example, DI: `ShipmentStore` vs Context + hooks).

## Try it yourself

Set a timer for 60 seconds and answer the question aloud: **"When would you choose Angular over React?"**

Requirements for the answer: 2–3 criteria, one honest drawback of Angular, one sentence about when you would choose React. No prepared text in front of you.

Hint: the structure is "context → criteria → trade-off → counter-case".

## Verify / Expected result

- The answer fit into 60 seconds and did not contain the words *always / never / better* without a qualifying "for …".
- You named at least one trade-off for each side.
- After your attempt, compare with the model answer in the Interview checkpoint below.

## Common mistake / Best practice

**Pitfall:** answering "Angular vs React" with personal preferences ("I like JSX more"). Consequence: the interviewer sees a lack of architectural thinking. **Correct:** start with the context (team, product lifetime, existing expertise, SSR/mobile requirements) and only then name the choice and its price.

## Interview checkpoint

**Q: When would you choose Angular over React?**

A: When several teams work on a long-lived application and consistency matters more than flexibility. Angular ships routing, forms, HTTP, DI and testing as one coherent, strongly typed platform with predictable upgrades, so teams don't spend time choosing and aligning libraries. The cost is a steeper learning curve and less freedom. For a small team, a content-heavy site with Next.js, or a product that shares code with React Native, I would lean towards React.

**Q: Can Angular and React coexist in one product?**

A: Yes, usually through micro-frontends or web components with a clear contract between them. It is a valid migration or organizational strategy, but it costs bundle size and operational complexity, so I would not choose it by default.

## Done when

- [ ] You can name 4 selection criteria from the table without peeking.
- [ ] You gave a 60-second answer aloud.
- [ ] You have one example from ParcelFlow Lite that illustrates the difference between the approaches.

---

Docs: [What is Angular?](https://angular.dev/overview) · [Angular roadmap](https://angular.dev/roadmap)

[← Previous: Accessibility and security basics](04-accessibility-and-security.md) · [Next: Final challenge: deleting a shipment →](06-final-challenge.md)
