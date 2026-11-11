# Day 1 · Lesson 2 — Angular CLI and workspace setup

**English** | [Українська](../../../uk/lessons/day-01-fundamentals/02-cli-and-workspace-setup.md)

**Estimated time:** 15 min · **Time budget:** read 3 · setup & run 9 · try 2 · verify 1

**Learning outcome:** your own Angular 22 workspace `practice/` is created with the CLI and running in the browser.

[← Previous: Angular vs React: mental model](01-angular-vs-react-mental-model.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Workspace tour: from angular.json to App →](03-workspace-tour.md)

## Why it matters

In Angular projects the CLI is the single entry point: creating a project, generating code, the dev server, the build, tests, version upgrades (`ng update`). In an interview you are expected to know the main commands.

## Concept

A **workspace** is a folder with `angular.json`; inside it there are one or more **projects** (applications or libraries). `ng new` creates a workspace with a single application.

| Command | What it does | React-world equivalent |
|---------|-----------|----------------------|
| `ng new <name>` | creates a workspace + application | `npm create vite@latest` |
| `ng serve` (`npm start`) | dev server with HMR on `:4200` | `vite dev` |
| `ng generate component <path>` | generates the component files | no standard one |
| `ng build` | production build into `dist/` | `vite build` |
| `ng test` | unit tests (Vitest) | `vitest` |

Inside a workspace the CLI is installed locally (`node_modules/.bin/ng`), so the course uses `npx ng …` — no global installation is needed.

> Caveat: the set of files and the questions asked by `ng new` change between major versions. Everything below was verified on CLI **22.2.6**; if you have a newer version, refer to <https://angular.dev/tools/cli>.

## Follow along

1. Check Node.js — you need `^22.22.3`, `^24.15.0` or `>=26`:

   ```bash
   node -v
   ```

2. From the **root of this repository**, create a workspace in the `practice/` folder:

   ```bash
   npx @angular/cli@22 new parcelflow-lite --directory practice --style css --ssr false --skip-git --ai-config none
   ```

   - `--directory practice` — the workspace folder (the project name stays `parcelflow-lite`);
   - `--style css`, `--ssr false`, `--ai-config none` — answers to the CLI questions given in advance (SSR is out of scope for the course);
   - `--skip-git` — we are already inside a Git repository;
   - answer the anonymous analytics question as you see fit (`N` is fine).

   Installing the dependencies takes 1–2 minutes. While you wait, read the Concept block once more.

3. Start the dev server:

   ```bash
   cd practice
   npm start
   ```

4. Open <http://localhost:4200>. The Angular starter page should appear with the text **Hello, parcelflow-lite**.

5. Without stopping the server, open `src/app/app.ts` and change the signal value:

   ```ts
   protected readonly title = signal('ParcelFlow Lite');
   ```

   Save the file — the page updates without a reload.

6. In a second terminal (from `practice/`), see what else the CLI can do:

   ```bash
   npx ng version
   npx ng generate --help
   ```

## Try it yourself

Make a production build and find where the CLI put the result. How big is the main JS bundle (raw and estimated transfer size)?

Hint: you need one command from the table above; the CLI prints the sizes in the terminal.

## Verify / Expected result

- `npx ng version` shows Angular CLI **22.x** and Angular **22.x**.
- <http://localhost:4200> shows the heading with the new title.
- After the build, a `dist/parcelflow-lite/browser/` folder appeared with `index.html` and a `main-<hash>.js` file (an empty application is roughly 200 kB raw / 55 kB transfer).

## Common mistake / Best practice

**Mistake:** creating the project with an outdated CLI that was installed globally long ago (`npm i -g @angular/cli`). **Consequence:** a different file structure (`app.component.ts`, NgModules, Karma), and the course code does not match. **Correct:** specify the major version explicitly (`npx @angular/cli@22 new …`), and inside the workspace always invoke the local CLI through `npx ng` or npm scripts.

## Interview checkpoint

**Q: What is the Angular CLI used for?**

A: It scaffolds workspaces and code (`ng new`, `ng generate`), runs the dev server, builds for production, runs tests, and automates version upgrades with `ng update`. It also enforces a standard project structure, which keeps Angular codebases consistent across teams.

**Q: What is the difference between a workspace and a project?**

A: A workspace is the folder configured by `angular.json`; it can contain several projects — applications and libraries — that share dependencies and tooling.

## Done when

- [ ] The `practice/` folder exists and contains `angular.json` and `node_modules/`.
- [ ] `npm start` brings the application up on `localhost:4200`, and the `title` change is visible in the browser.
- [ ] `npx ng build` finishes without errors.

---
Docs: [Installation](https://angular.dev/installation) · [CLI overview](https://angular.dev/tools/cli) · [Version compatibility](https://angular.dev/reference/versions)

[← Previous: Angular vs React: mental model](01-angular-vs-react-mental-model.md) · [Next: Workspace tour: from angular.json to App →](03-workspace-tour.md)
