# Sanket Sneho (সংকেত স্নেহ)

> **প্রতিদিনের খোঁজ, প্রয়োজনে পাশে।**

Sanket Sneho is a Bengali-first safety and welfare assistance prototype for elderly citizens in rural Bengal. This repository currently contains the first web MVP of the Phase 1 experience: a large daily check-in action, buddy escalation simulation, separate SOS and ambulance flows, Bengali voice input as an optional enhancement, and offline-tolerant local state.

## Current MVP scope

The current build is a **front-end test prototype**, not a live emergency dispatch or government service. It includes an elder home screen, check-in persistence in browser local storage, online/offline status, activity history, a sample buddy profile, simulated missed check-in alerts, and a confirmation-based emergency modal. No real SMS, FCM, ambulance dispatch, government submission, or personal-data backend is connected yet.

The production roadmap is documented in [`docs/sanket-sneho-build-plan.md`](docs/sanket-sneho-build-plan.md). Phase 2 and later modules must wait until Phase 1 is tested end-to-end on at least two physical devices.

## Design direction

The interface uses a warm saffron, deep teal, and cream palette. Bengali is the default language, with high contrast, large touch targets, visible focus states, minimal navigation, and distinct colors for check-in, SOS, and ambulance actions. The responsive shell works well on a narrow phone viewport and expands into a centered tablet/desktop preview.

## Local development

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

Run lint checks with:

```bash
npm run lint
```

## Important safety boundary

This is a test-mode prototype. Emergency actions currently create local test records and show a safe confirmation flow. They do not contact a real buddy, family member, health centre, or ambulance service. Before any field pilot, the project needs authenticated backend APIs, role-based access control, consent flows, encrypted transport, server-side audit logs, verified emergency contacts, notification delivery, and a human-reviewed operating procedure.

## Repository structure

```text
src/
  App.jsx          # Phase 1 elder experience and local state
  index.css        # Sanket Sneho visual system and responsive styles
  main.jsx         # React entry point
  services/        # Existing service layer placeholder
public/            # Small static configuration and favicon assets
docs/
  sanket-sneho-build-plan.md
```

## Next build step

The next implementation iteration should add the backend contract and authenticated role flows for elder, buddy, family, and block staff. The first gate remains a simulated missed check-in that is visible to a second buddy device, followed by a documented offline, duplicate-tap, permission-denied, and no-response test run.

## Routine health logging

The current MVP also includes a Bengali-first `স্বাস্থ্য` tab for daily wellness logging. An elder can record mood, sleep, food, medicine routine, optional temperature, pulse, blood pressure values, and a short note. Entries are stored locally for the prototype and shown in recent history. The feature is intentionally non-diagnostic: it records user-entered values but does not interpret them or provide treatment advice.
