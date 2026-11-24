# Agnithon frontend

Responsive, frontend-only Agnithon hackathon landing page built with React, TypeScript, and Vite. It does not include a backend, database, sign-in, or fake registration flow. Registration buttons open the editable Unstop link.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`; preview it with `npm run preview`.

## Update event details

Edit [`src/data/hackathonConfig.ts`](src/data/hackathonConfig.ts) to update the registration URL, countdown date, tracks, problem statements, timeline, prizes, eligibility, FAQ, organizer, and contact placeholders. Search for `TODO: UPDATE BEFORE LAUNCH` to find launch items.
