# Day 5 · Lesson 4 — Accessibility and security basics

**English** | [Українська](../../../uk/lessons/day-05-quality-interview/04-accessibility-and-security.md)

**Estimated time:** 5 min · **Time budget:** read 2 · keyboard walk-through 2 · try 1

**Learning outcome:** walk through ParcelFlow Lite using only the keyboard and name what Angular takes care of in frontend security and what the backend does.

[← Previous: Production structure and common mistakes](03-production-structure-and-mistakes.md) · [Course plan](../../COURSE-PLAN.md) · [Next: Angular vs React: decision guide →](05-angular-vs-react-decision-guide.md)

## Why it matters

Accessibility is a requirement in most enterprise projects (WCAG, government and financial customers), and XSS and "secrets in the bundle" are the most common frontend security mistakes. Both topics are typical short interview questions.

## Concept

**Accessibility — what your code already has:**

| Technique | Where in ParcelFlow Lite |
| --- | --- |
| `<label for>` + `id`, or a `<label>` that wraps the input | the form; the search in the list |
| Real `<button>` / `<a routerLink>` instead of `<div (click)>` | filters, card, navigation |
| `aria-pressed` for toggle buttons | status filter |
| `role="status"` (loading) / `role="alert"` (error) | list, details |
| `aria-describedby` → an error container with `aria-live="polite"` | form fields |
| `ariaCurrentWhenActive="page"` on `routerLinkActive` | header nav |

Native elements give you focus, Enter/Space and screen reader roles for free — which is why a "clickable div" is a mistake, not a style.

**Security in the frontend context:**

- Interpolation `{{ value }}` **escapes** HTML; `[innerHTML]` is **sanitized** by Angular (scripts and dangerous attributes are stripped). React parallel: JSX escaping and `dangerouslySetInnerHTML`.
- Never call `bypassSecurityTrustHtml` (or the other `bypassSecurityTrust*` methods) for data from the user or an API.
- There are no secrets in a frontend bundle: anything that ends up in the JS can be read by anyone (API keys, client secrets).
- Authorization is performed on the backend. Route guards and hidden buttons are UX, not protection.
- Tokens are added centrally through interceptors: `provideHttpClient(withInterceptors([...]))`; `HttpClient` has built-in XSRF support (cookie → header).
- For sessions, prefer HttpOnly cookies or short-lived tokens over long-lived tokens in `localStorage`.

## Follow along

1. Run `npx ng serve`, open `http://localhost:4200/shipments` and **put the mouse aside**.
2. `Tab` through the page: navigation → filters → search → the cards' links and buttons. The focus must be visible and follow the reading order.
3. On a filter button press `Enter` or `Space` — the filter changes. On a tracking number press `Enter` — the details open.
4. `Tab` to `New shipment` and press `Enter`. In the form, press `Enter` in an empty field — error messages appear; fill in the fields and submit the form with the keyboard.
5. In DevTools → Elements, check for `aria-pressed="true"` on the active filter button and for `aria-current="page"` on the active menu item.

## Try it yourself

In `shipment-details.html`, temporarily render the event description through `[innerHTML]` and feed it (in the JSON fixture or right in the template) the string `<img src=x onerror="alert(1)">`. What gets rendered and what appears in the console? After the experiment, **restore the interpolation**.

Hint: look for a sanitization warning in the console.

## Verify / Expected result

- Every action (filter, search, navigating to the details, creating a shipment) can be done without the mouse.
- The `alert` from the experiment does **not** fire; the console shows `WARNING: sanitizing HTML stripped some content`.
- There is no `bypassSecurityTrust` anywhere in `src/`: `grep -rn "bypassSecurityTrust" src/` returns nothing.

## Common mistake / Best practice

**Pitfall:** `<div class="btn" (click)="open()">`. Consequence: the element does not receive focus, does not react to Enter/Space and is invisible to a screen reader as a button — a keyboard user cannot perform the action. **Correct:** `<button type="button">` for actions, `<a routerLink>` for navigation; `tabindex`, `role` and `keydown` handlers are needed only for truly custom widgets (and then Angular CDK / Angular Aria is the better choice).

## Interview checkpoint

**Q: How does Angular protect against XSS?**

A: Angular treats all bound values as untrusted: interpolation is escaped and bindings like `innerHTML` are sanitized automatically. The risk appears when developers bypass it with `bypassSecurityTrust*` or manipulate the DOM directly, so those should be avoided for user-controlled data.

**Q: Are route guards a security mechanism?**

A: No, they are a UX mechanism. Any client-side check can be bypassed, so authorization must be enforced by the backend on every request.

## Done when

- [ ] You went through the "list → filter → details → new shipment" scenario using only the keyboard.
- [ ] You saw Angular strip `onerror` from `[innerHTML]` and restored the template to interpolation.
- [ ] You can name 3 a11y techniques from your code and 3 frontend security rules.

---

Docs: [Accessibility](https://angular.dev/best-practices/a11y) · [Security](https://angular.dev/best-practices/security) · [HTTP interceptors](https://angular.dev/guide/http/interceptors)

[← Previous: Production structure and common mistakes](03-production-structure-and-mistakes.md) · [Next: Angular vs React: decision guide →](05-angular-vs-react-decision-guide.md)
