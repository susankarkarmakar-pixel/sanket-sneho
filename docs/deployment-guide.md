# Sanket Sneho (সংকেত স্নেহ)
## Complete Deployment Guide

**Repository:** [susankarkarmakar-pixel/sanket-sneho](https://github.com/susankarkarmakar-pixel/sanket-sneho)  
**Application type:** React + Vite static frontend  
**Current state:** Phase 1 • Test mode  
**Last updated:** 24 August 2026

## 1. Deployment overview

Sanket Sneho বর্তমান অবস্থায় একটি client-side React/Vite application। Production bundle তৈরি হলে `dist/` directory-তে static HTML, CSS, JavaScript এবং ছোট public assets তৈরি হয়। Vite-এর official guidance অনুযায়ী `npm run build`-এর পরে এই `dist` directory static hosting platform-এ deploy করা যায়, আর `vite preview` local production preview-এর জন্য ব্যবহার করা উচিত—production server হিসেবে নয়। [1] [2]

| বিষয় | বর্তমান implementation |
|---|---|
| Frontend | React with Vite |
| Build output | `dist/` |
| Data storage | Browser `localStorage` |
| Backend API | নেই |
| Authentication | নেই |
| Notification | Browser permission থাকলে browser notification; নইলে in-app fallback |
| Emergency dispatch | নেই; SOS/ambulance state test-mode |
| Recommended first hosting | GitHub Pages, Netlify, Vercel অথবা Cloudflare Pages |

> **Production warning:** এই static deployment real SMS, FCM push, backend synchronization, secure multi-user family access, verified emergency dispatch বা clinical data service তৈরি করে না। Pilot demonstration-এর জন্য deploy করুন; real public service চালুর আগে backend, authentication, privacy controls, monitoring এবং incident response যোগ করুন।

## 2. Prerequisites

Local machine-এ Git, Node.js LTS এবং npm ইনস্টল থাকতে হবে। Repository clone করার পরে project root-এ command চালাতে হবে।

```bash
git clone https://github.com/susankarkarmakar-pixel/sanket-sneho.git
cd sanket-sneho
npm install
```

Node/npm version যাচাই করতে পারেন:

```bash
node --version
npm --version
```

Local development server চালাতে:

```bash
npm run dev
```

সাধারণত Vite development server একটি local URL দেখাবে। Browser-এ সেই URL খুলে প্রথমবার onboarding সম্পূর্ণ করুন। Local data browser-এর origin অনুযায়ী আলাদা থাকে; অন্য browser বা incognito window-তে আগের profile দেখা যাবে না।

## 3. Quality checks before deployment

Deployment-এর আগে clean dependency install, production build, lint এবং whitespace check চালান। Repository-তে `package-lock.json` থাকলে `npm ci` ব্যবহার করুন; না থাকলে `npm install` ব্যবহার করুন।

```bash
npm install
npm run build
npm run lint
git diff --check
```

এই project-এর current build command Vite bundle তৈরি করে। Production output inspect করতে:

```bash
npm run preview
```

Official Vite documentation অনুযায়ী `dist` default output directory এবং `vite preview` built app locally inspect করার জন্য; এটি production hosting server হিসেবে intended নয়। [1]

## 4. Recommended deployment: GitHub Pages

GitHub Pages এই repository-এর জন্য একটি সহজ static hosting option। Repository URL যদি `https://susankarkarmakar-pixel.github.io/sanket-sneho/` হয়, তাহলে Vite asset base path repository name অনুযায়ী সেট করা প্রয়োজন। Vite-এর official GitHub Pages instructions অনুযায়ী project-site deployment-এ `base` সাধারণত `'/<REPO>/'` ব্যবহার করে। [1]

### 4.1 Configure the Vite base path

`vite.config.js`-এ `base` যোগ করুন:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/sanket-sneho/',
  plugins: [react(), tailwindcss()],
})
```

আপনি যদি custom domain বা user-site root (`https://username.github.io/`) ব্যবহার করেন, তাহলে `base: '/'` রাখুন অথবা `base` বাদ দিন। Base path বদলানোর পরে local preview এবং production asset URL পরীক্ষা করুন।

### 4.2 Add a GitHub Actions workflow

Repository root-এ `.github/workflows/deploy.yml` তৈরি করুন:

```yaml
name: Deploy Sanket Sneho to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 4.3 Enable Pages

GitHub repository-তে **Settings → Pages** খুলুন। **Build and deployment** section-এ source হিসেবে **GitHub Actions** নির্বাচন করুন। এরপর workflow file commit ও push করলে Actions tab-এ build/deploy status দেখা যাবে। Deploy সফল হলে GitHub Pages URL-এ application খুলুন।

### 4.4 GitHub Pages verification

Deployment-এর পরে এই checks করুন:

| Check | Expected result |
|---|---|
| Root URL | Sanket Sneho onboarding বা dashboard খুলবে |
| Hard refresh | Blank page হবে না |
| Favicon | Sanket Sneho mark দেখা যাবে |
| `/assets/` files | CSS/JS load হবে |
| Local storage | Profile ও health records একই browser-এ থাকবে |
| Browser notification | HTTPS page-এ permission prompt ব্যবহার করা যাবে |
| Mobile viewport | Bottom navigation ও large buttons usable থাকবে |

## 5. Netlify deployment

Netlify-তে Git repository import করলে প্রতিটি production branch push-এর পরে automatic deploy এবং pull request preview পাওয়া যায়। [1]

Netlify dashboard-এ **Add new project → Import an existing project** নির্বাচন করুন, GitHub connect করুন এবং `sanket-sneho` repository বেছে নিন। Build settings দিন:

```text
Build command: npm run build
Publish directory: dist
Production branch: main
```

এই project-এর জন্য কোনো frontend environment variable প্রয়োজন নেই। যদি ভবিষ্যতে backend API URL যোগ করা হয়, তা Netlify environment variables-এ রাখুন এবং secret কখনো client source code-এ লিখবেন না। Netlify-তে deploy করার সময় GitHub Pages-এর মতো repository base path প্রয়োজন হয় না যদি app domain root-এ serve হয়; সেক্ষেত্রে `base: '/'` রাখুন।

Netlify CLI ব্যবহার করতে চাইলে:

```bash
npm install -g netlify-cli
netlify login
netlify init
npm run build
netlify deploy --dir=dist
netlify deploy --prod --dir=dist
```

## 6. Vercel deployment

Vercel-এ GitHub repository import করুন। Vercel Vite project detect করতে পারে এবং সাধারণত build configuration হিসেবে `npm run build` ও output `dist` ব্যবহার করা যায়। [1]

Dashboard configuration:

```text
Framework preset: Vite
Build command: npm run build
Output directory: dist
Install command: npm install
Production branch: main
```

CLI option:

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

Custom domain যোগ করার পরে browser notification permission এবং geolocation-এর জন্য HTTPS নিশ্চিত করুন।

## 7. Cloudflare Pages deployment

Cloudflare Pages-এ **Create a new Project → Pages → Connect to Git** নির্বাচন করুন এবং repository connect করুন। Framework preset হিসেবে Vite বেছে নিন অথবা manual settings দিন:

```text
Build command: npm run build
Build output directory: dist
Production branch: main
```

Cloudflare Pages Git integration-এ production branch push করলে deployment এবং preview deployment তৈরি হতে পারে। [1] Cloudflare Worker বা server-side API যোগ করার প্রয়োজন না হলে বর্তমান static project-এ আলাদা Worker plugin প্রয়োজন নেই।

## 8. Notification and secure-context requirements

এই application browser-এর Notification API ব্যবহার করতে পারে। Browser notification permission user-এর হাতে থাকে এবং deployment-এ HTTPS ব্যবহার করা উচিত। MDN-এর documentation অনুযায়ী Notification API supporting browsers-এ secure context-এর সঙ্গে সম্পর্কিত; localhost development ব্যতিক্রমীভাবে কাজ করতে পারে, কিন্তু public deployment-এর জন্য HTTPS ব্যবহার করুন। [3]

Permission না পাওয়া গেলে app in-app reminder দেখাবে। Browser বন্ধ থাকলে বা operating system notification blocked থাকলে background reminder সব platform-এ নিশ্চিত নয়। Production mobile app-এর জন্য native local notification scheduler, service worker strategy, বা authenticated push service প্রয়োজন হবে।

## 9. Data, privacy, and production architecture

বর্তমান app browser `localStorage`-এ profile, health logs, contacts, emergency states এবং reminder settings রাখে। Static hosting এই data server-এ পাঠায় না। এর ফলে prototype privacy exposure কম থাকলেও device loss, shared browser, data clearing এবং cross-device access-এর সমস্যা থাকে।

Production architecture-এ অন্তত এই layer-গুলি প্রয়োজন হবে:

| Layer | Production requirement |
|---|---|
| Identity | Elder, family এবং buddy-এর authenticated accounts |
| Access control | Role-based visibility ও consent checks |
| Data | Encrypted database, backups এবং retention policy |
| Sync | Authenticated API, conflict resolution এবং retry queue |
| Emergency | Verified recipients, delivery status এবং audit trail |
| Notifications | SMS/FCM/native notification provider, opt-in consent |
| Health data | Data minimization, clinician review boundary এবং export/delete controls |
| Operations | Error monitoring, uptime monitoring এবং incident response |

কোনো API key, database credential, private token বা service secret Vite client source code-এ রাখবেন না। Static frontend-এ exposed environment variable secret নয়; backend proxy বা server-side function ব্যবহার করতে হবে।

## 10. Service worker and future PWA path

বর্তমান version localStorage ও in-app fallback ব্যবহার করে; এটি full PWA offline cache নয়। True offline-first production release-এ service worker precache, versioned cache invalidation, IndexedDB queue, authenticated sync endpoint, conflict policy এবং background sync দরকার হবে। Service worker যোগ করার পরে update rollout ভালোভাবে পরীক্ষা করুন, কারণ stale asset cache নতুন deployment-এর সঙ্গে conflict করতে পারে।

Vite build guide অনুযায়ী build output cache policy ও asset versioning deployment design-এর অংশ হওয়া উচিত; HTML-এর cache যেন পুরোনো hashed asset-এর দিকে অনির্দিষ্টভাবে না থাকে তা hosting configuration-এ যাচাই করুন। [2]

## 11. Post-deployment smoke test

Production URL পাওয়ার পরে একটি fresh browser profile-এ smoke test করুন। প্রথমে onboarding সম্পূর্ণ করুন, তারপর check-in এবং health log save করুন। Family dashboard-এ contacts ও report preview দেখুন। Report `.txt` download হচ্ছে কি না পরীক্ষা করুন। Profile থেকে reminder enable করে test চাপুন। Browser notification permission না দিলে in-app fallback message দেখা উচিত।

SOS ও ambulance flow-কে test mode হিসেবে যাচাই করুন এবং real emergency service ধরে কোনো test call বা alert পাঠাবেন না। Browser console-এ কোনো uncaught error আছে কি না পরীক্ষা করুন। Mobile Chrome এবং desktop Chrome/Firefox/Safari-এর অন্তত একটি করে viewport পরীক্ষা করুন।

## 12. Updating the deployed application

Code update-এর জন্য feature branch তৈরি করুন, local checks চালান, তারপর `main`-এ merge করুন:

```bash
git checkout -b feature/your-change
npm install
npm run build
npm run lint
git diff --check
git add .
git commit -m "Describe the change"
git push origin feature/your-change
```

Pull request review ও smoke test-এর পরে `main` merge করুন। GitHub Pages, Netlify, Vercel অথবা Cloudflare Pages configured থাকলে production deployment automatically শুরু হতে পারে। Deployment ব্যর্থ হলে build log, Node version, base path, publish directory এবং environment variable check করুন।

## 13. Rollback

Production issue হলে শেষ known-good commit identify করুন। GitHub Pages বা Git provider deployment history থেকে আগের successful deployment পুনরায় publish করুন। Code rollback করতে:

```bash
git log --oneline --decorate -10
git revert <bad-commit-sha>
git push origin main
```

Emergency-related UI change হলে rollback-এর পাশাপাশি pilot users-কে সতর্ক করুন। কোনো health বা contact data migration থাকলে rollback-এর আগে backup এবং schema compatibility যাচাই করুন।

## 14. Recommended next production steps

প্রথমে repository-এর static deployment stabilise করুন। এরপর backend authentication ও encrypted sync যোগ করুন। তারপর family/buddy role access, real notification provider, service worker/IndexedDB queue, audit logs, consent management এবং formal privacy review বাস্তবায়ন করুন। Real emergency dispatch বা clinical decision support যোগ করার আগে domain experts, legal/privacy review এবং field pilot validation সম্পন্ন করুন।

## References

[1]: <https://vite.dev/guide/static-deploy> “Vite — Deploying a Static Site”

[2]: <https://vite.dev/guide/build> “Vite — Building for Production”

[3]: <https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API> “MDN — Notifications API”
