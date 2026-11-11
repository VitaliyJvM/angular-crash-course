# ParcelFlow Lite

Reference implementation of the learning application from the **Angular Crash Course for Experienced Developers**: a small shipment-tracking app built on Angular 22 with standalone components, signals, `HttpClient`, the Angular Router, Signal Forms and Vitest.

It has no backend. Shipments are loaded with HTTP GET from the static fixture `public/data/shipments.json`; creating a shipment and "Mark delivered" change state in memory only and disappear on reload.

This workspace is the state of the project after Day 5, without the final challenge. Learners build their own copy in `practice/` and use this one for comparison.

- Course (English): [README.md](../README.md) · [Course plan](../docs/en/COURSE-PLAN.md)
- Курс (українською): [README.uk.md](../README.uk.md) · [План курсу](../docs/uk/COURSE-PLAN.md)

## Commands

Run from this folder:

```bash
npm install
npm start                  # ng serve → http://localhost:4200
npx ng test --no-watch     # unit tests (Vitest + jsdom)
npx ng build               # production build into dist/
```

Generated with Angular CLI 22.2.6. See <https://angular.dev/tools/cli> for CLI reference.
