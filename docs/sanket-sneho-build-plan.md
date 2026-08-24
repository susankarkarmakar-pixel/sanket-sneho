# Sanket Sneho (সংকেত স্নেহ)
## উন্নয়ন, রিব্র্যান্ডিং ও Phase 1 বাস্তবায়ন পরিকল্পনা

**প্রস্তুতকারক:** Manus AI  
**ভিত্তি:** ব্যবহারকারীর দেওয়া অ্যাপ-রোডম্যাপ এবং বিদ্যমান GitHub রিপোজিটরি পর্যালোচনা  
**প্রস্তাবিত প্রোডাক্ট নাম:** **Sanket Sneho (সংকেত স্নেহ)**  
**প্রস্তাবিত repository slug:** `sanket-sneho`

---

## 1. পরিকল্পনার সারাংশ

বিদ্যমান `baba-ma-digital-sathi` রিপোজিটরিটিকে এখন থেকে **Sanket Sneho (সংকেত স্নেহ)** নামে পুনর্ব্র্যান্ড করা হবে। নামের বাংলা অর্থ, ভিজ্যুয়াল পরিচয়, অ্যাপের title, browser metadata, README, code-level copy এবং পরবর্তী documentation—সব জায়গায় একই bilingual branding ব্যবহার করা হবে। GitHub URL-এর জন্য ছোট ASCII slug `sanket-sneho` রাখা হবে; অ্যাপের দৃশ্যমান নাম হবে `Sanket Sneho` এবং বাংলা display name হবে `সংকেত স্নেহ`।

আপনার দেওয়া roadmap অনুযায়ী পুরো system একসঙ্গে অর্ধসমাপ্ত করার পরিবর্তে প্রথমে **Phase 1-এর end-to-end safety flow** তৈরি ও যাচাই করা হবে। Phase 1 সফলভাবে পরীক্ষা না হওয়া পর্যন্ত pension grievance, document update, scheme discovery এবং voice-routing-এর পূর্ণাঙ্গ সংস্করণ শুরু করা হবে না।

---

## 2. বর্তমান রিপোজিটরি অডিট

| বিষয় | বর্তমান অবস্থা | পরিকল্পনায় সিদ্ধান্ত |
|---|---|---|
| GitHub repository | `susankarkarmakar-pixel/baba-ma-digital-sathi` | নতুন পরিচয় হবে **Sanket Sneho**; rename-এর আগে branch ও backup নিরাপদ রাখা হবে |
| বর্তমান project type | React + Vite web prototype | দ্রুত prototype হিসেবে রাখা যেতে পারে; production mobile app-এর জন্য Flutter এবং backend আলাদা করে যোগ করতে হবে |
| বর্তমান UI | একক voice-first Hindi chat screen | এটিকে Phase 1-এর safety dashboard-এ রূপান্তর করা হবে |
| বর্তমান voice input | Browser Speech Recognition API-নির্ভর, Hindi default | Phase 1-এ optional voice affordance থাকবে; মূল safety action হবে বড় touch button-ভিত্তিক |
| বর্তমান AI behavior | `src/services/aiService.js`-এ simulated keyword response | safety alert-এর পরিবর্তে ভুয়া response ব্যবহার করা যাবে না; real backend flow-এর জন্য service layer তৈরি হবে |
| Backend | নেই | Phase 1-এর জন্য authentication, user records, assignments, check-ins, alerts এবং audit log-এর backend দরকার |
| Database | নেই | prototype-এ local mock বা SQLite দিয়ে শুরু করা যেতে পারে; pilot-এর আগে PostgreSQL-এ যাওয়া হবে |
| Notifications | নেই | প্রথমে in-app state এবং test notification; তারপর push/SMS fallback সংযুক্ত হবে |
| Offline support | নেই | local queue এবং retry/sync strategy Phase 1-এর acceptance criteria-তে থাকবে |
| Security/access control | নেই | elder, buddy, family এবং staff role অনুযায়ী access control শুরু থেকেই design করতে হবে |

**মূল সিদ্ধান্ত:** বর্তমান repository-কে শুধু নাম বদলে final product বলা যাবে না। এটি বর্তমানে একটি voice demo; roadmap-এর Phase 1 সম্পূর্ণ করতে safety workflow, data model, backend, notification orchestration এবং test environment যোগ করতে হবে।

---

## 3. Branding ও নাম পরিবর্তনের scope

### 3.1 Naming standard

| ব্যবহারক্ষেত্র | নির্ধারিত নাম |
|---|---|
| Product name | `Sanket Sneho` |
| Bengali display name | `সংকেত স্নেহ` |
| Full app label | `Sanket Sneho — সংকেত স্নেহ` |
| Repository slug | `sanket-sneho` |
| Internal package/project naming | `sanket_sneho` বা `sanket-sneho` |
| Short description | `Rural elder safety, welfare and assistance platform` |
| বাংলা tagline-এর প্রস্তাব | `প্রতিদিনের খোঁজ, প্রয়োজনে পাশে` |

### 3.2 Rename checklist

1. GitHub repository-এর নাম `baba-ma-digital-sathi` থেকে `sanket-sneho` করার আগে current `main` branch, open changes এবং deployment references যাচাই করা হবে।
2. `package.json`-এর placeholder name `temp-app` পরিবর্তন করে `sanket-sneho` করা হবে।
3. `index.html`-এর title `Sanket Sneho — সংকেত স্নেহ` করা হবে এবং `lang` metadata Bengali-first করা হবে।
4. App header, greeting, error message, accessibility label, favicon, README এবং documentation-এ পুরনো `Digital Sathi`, `बाबा`, অথবা template text-এর পরিবর্তে নতুন branding বসানো হবে।
5. `src/services/aiService.js`-এর demo copy-কে safety-product copy দিয়ে প্রতিস্থাপন করা হবে; কোনো simulated action-কে বাস্তব call, ambulance dispatch বা alert হিসেবে দেখানো হবে না।
6. নতুন `README.md`-তে product purpose, target users, privacy boundary, development commands, environment variables এবং phase gate লেখা হবে।
7. repository-তে `docs/build-roadmap.md` এবং `docs/sanket-sneho-build-plan.md` রাখা হবে, যাতে product name ও implementation decision ভবিষ্যতে একরকম থাকে।

---

## 4. প্রস্তাবিত প্রযুক্তিগত দিক

আপনার roadmap-এ Flutter + Node.js/Express + PostgreSQL উল্লেখ আছে। বর্তমান repository React/Vite হওয়ায় দুটি পথ আছে।

| পথ | সুবিধা | অসুবিধা | সিদ্ধান্ত |
|---|---|---|---|
| বর্তমান React/Vite prototype-কে আরও বাড়ানো | দ্রুত UI demo এবং browser testing | Android APK, background behavior, device permissions এবং offline behavior production-grade করা কঠিন | UI concept validation-এর জন্য সীমিতভাবে ব্যবহার |
| Flutter mobile app + Node/Express backend | Android-first app, device capability, local storage, notification এবং future APK pilot-এর জন্য উপযুক্ত | নতুন app structure ও backend setup লাগবে | **Production implementation-এর জন্য প্রস্তাবিত** |

**প্রস্তাবিত architecture:**

- **Mobile:** Flutter, Bengali-first Android UI, Hindi/English toggle, local persistence এবং permission-aware services।
- **Backend:** Node.js + Express REST API; role-based authorization এবং event/audit logging।
- **Database:** প্রথম prototype-এ SQLite বা mock repository; pilot-এর আগে PostgreSQL।
- **Notification:** Phase 1-এ test push/in-app event; পরবর্তী iteration-এ FCM এবং প্রয়োজন অনুযায়ী SMS provider।
- **Location:** SOS এবং ambulance flow-এর সময় permission নিয়ে GPS coordinate পাঠানো; অপ্রয়োজনীয় continuous tracking নয়।
- **Voice:** safety flow stable হওয়ার পরে Bengali/Hindi voice classification; voice unavailable হলেও সব মূল action বড় button-এ চালু থাকবে।

---

## 5. ধাপে ধাপে Build Plan

### Phase 0 — Rebrand, foundation ও design contract

এই প্রস্তুতি ধাপে product identity এবং technical foundation স্থির করা হবে। Repository rename, package metadata, app title, logo direction, color tokens, Bengali copy এবং folder structure এক জায়গায় নির্ধারণ করা হবে। Existing React prototype-টি reference/demo হিসেবে রাখা হবে, কিন্তু production feature-এর source of truth হবে নতুন mobile/backend structure।

**Completion gate:** নাম, tagline, role vocabulary, Bengali copy এবং data/privacy boundary অনুমোদিত; clean build চলে; পুরনো placeholder branding আর নেই।

### Phase 1 — Registration + daily check-in + buddy escalation + SOS + ambulance

এটাই প্রথম এবং বাধ্যতামূলক delivery। Elder onboarding-এ নাম, ফোন, village/ward, date of birth, gender, optional pension information এবং emergency contacts নেওয়া হবে। Buddy assignment-এ elder-এর সঙ্গে Anganwadi/ASHA worker বা trained volunteer যুক্ত হবে।

Home screen-এ সবচেয়ে বড় element হবে **“আজ ভালো আছি”** button। Default deadline 6 PM configurable থাকবে। Check-in না হলে backend alert state তৈরি করবে; প্রথমে assigned buddy-কে alert, নির্দিষ্ট সময়ের মধ্যে acknowledgement না এলে registered family-কে escalation। SOS এবং ambulance flow আলাদা থাকবে।

| Flow | Expected behavior |
|---|---|
| Daily check-in | Elder একবার tap করলে আজকের status `checked_in` হবে; duplicate tap idempotent হবে |
| Missed check-in | Deadline পার হলে `missed` event এবং buddy alert তৈরি হবে |
| Buddy acknowledgement | Buddy alert গ্রহণ/acknowledge করলে escalation থামবে এবং event log হবে |
| Family escalation | Buddy নির্ধারিত window-এ respond না করলে family notification যাবে |
| SOS | Buddy, family এবং configured health contact-কে alert; permission থাকলে GPS coordinate সংযুক্ত |
| Ambulance | SOS-এর সঙ্গে মিশবে না; আলাদা confirm screen, location share এবং configured 108 call/connect flow |
| Offline check-in | Internet না থাকলে local queue; network ফিরলে sync; user-কে স্পষ্ট sync status দেখানো হবে |
| Missed-call fallback | Dedicated number ও call-handling integration-কে interface হিসেবে design করা হবে; live telephony integration pilot-এর আগে সংযুক্ত হবে |

**Phase 1-এর প্রস্তাবিত entities:** `User`, `EmergencyContact`, `BuddyAssignment`, `CheckIn`, `Alert`, `AlertAcknowledgement`, `LocationEvent`, `AuditLog`।

### Phase 2 — Pension grievance ও Block staff dashboard

Elder pension type এবং issue type বেছে structured grievance submit করবেন। Beneficiary ID profile থেকে auto-attach হবে। Staff dashboard public complaint board হবে না; authorized Block/Panchayat staff কেবল assigned records দেখবেন। Status হবে `Submitted → Under Review → Resolved`, সঙ্গে timestamps এবং audit history।

### Phase 3 — Jeevan Pramaan reminder

Pensioner-এর জন্য annual reminder, deadline-oriented notification, nearest CSC/post office information এবং available doorstep service request-এর interface তৈরি হবে। কোনো service availability বা government workflow-কে নিশ্চিত service হিসেবে দেখানো হবে না; location এবং availability যাচাই করে user-কে next step জানানো হবে।

### Phase 4 — Document update requests

Voter, Aadhaar এবং bank/DBT request-এর জন্য pre-filled details, review screen এবং print-ready PDF তৈরি হবে। App কোনো government database-এ direct write করবে না। Digital forwarding থাকলে তা authorized intake channel ও human official processing-এর মাধ্যমে হবে। Sensitive identifiers প্রয়োজনের বেশি সংরক্ষণ করা হবে না।

### Phase 5 — Scheme discovery ও application help

Age, gender, widow status, disability status এবং pension profile-এর ভিত্তিতে সম্ভাব্য scheme match দেখানো হবে। Match-কে final eligibility verdict বলা হবে না; user-কে relevant office/CSC-তে verification ও submission-এর পথ দেখানো হবে। Pre-filled application generate করার আগে user review ও consent লাগবে।

### Phase 6 — Voice-first navigation

Bengali/Hindi speech input দিয়ে issue classification করা হবে এবং user-কে pension, document, scheme বা emergency flow-এ নেওয়া হবে। Emergency শব্দ/intent পাওয়া গেলে confirmation ও immediate action path থাকবে, কিন্তু false positive কমানোর জন্য clear spoken/readable confirmation রাখা হবে। Voice unavailable হলে manual large-button navigation সমানভাবে কার্যকর থাকবে।

### Phase 7 — Pilot packaging ও Gazole field test

ছোট পরিসরে volunteer/buddy এবং elder device-এ signed Android APK side-load করে pilot চালানো হবে। Pilot-এ network quality, device model, battery usage, Bengali comprehension, alert response time, false alarm এবং missed escalation নথিবদ্ধ হবে। বাস্তব ব্যবহারকারীর sensitive data নেওয়ার আগে consent, access policy এবং deletion/retention process প্রস্তুত থাকতে হবে।

---

## 6. Phase 1-এর প্রস্তাবিত কাজের ক্রম

| ক্রম | কাজ | ফলাফল |
|---:|---|---|
| 1 | Rebrand এবং app shell | Sanket Sneho নামে clean branded app |
| 2 | Role ও onboarding model | Elder, buddy, family, staff profile এবং emergency contact |
| 3 | API contract ও persistence | User, assignment, check-in, alert এবং audit endpoints |
| 4 | Elder home screen | Bengali-first large touch targets; check-in, SOS, ambulance |
| 5 | Buddy view | Assigned elders, missed check-ins, acknowledge/escalate actions |
| 6 | Family notification view | Elder status এবং escalation event visibility |
| 7 | Deadline worker | Configurable daily deadline ও alert generation |
| 8 | Offline queue | Local event queue, retry, conflict/idempotency handling |
| 9 | GPS permission ও emergency flow | Consent-based location capture, separate ambulance flow |
| 10 | Two-device simulation | Elder device + buddy device দিয়ে end-to-end test |
| 11 | Failure and safety review | No network, denied location, duplicate tap, app restart, no response |
| 12 | Phase gate review | Simulated real buddy escalation সফল না হওয়া পর্যন্ত Phase 2 নয় |

---

## 7. Phase 1 Acceptance Criteria

Phase 1 সম্পূর্ণ বলা হবে কেবল তখনই, যখন নিচের সব শর্ত সফলভাবে demonstrable হবে।

1. কমপক্ষে দুইটি Android test device-এ elder এবং buddy role দিয়ে onboarding করা যায়।
2. Elder-এর একটি tap-এ Bengali confirmation দেখা যায় এবং backend/local state-এ check-in তৈরি হয়।
3. Configurable deadline পার হলে buddy alert তৈরি হয় এবং alert status দেখা যায়।
4. Buddy নির্ধারিত window-এ respond করলে family escalation হয় না।
5. Buddy respond না করলে family escalation event তৈরি হয়।
6. SOS এবং ambulance button আলাদা visual ও logical flow হিসেবে কাজ করে।
7. GPS permission denied হলেও emergency flow আটকে থাকে না; user স্পষ্ট fallback পান।
8. Network বন্ধ থাকা অবস্থায় check-in হারিয়ে যায় না এবং connectivity ফিরলে duplicate ছাড়া sync হয়।
9. Role boundary ভেঙে অন্য elder-এর private record দেখা যায় না।
10. App restart, duplicate taps এবং repeated alert worker run-এর পরেও data corruption হয় না।
11. অন্তত একটি real buddy-escalation scenario simulated end-to-end চালানো হয় এবং result নথিভুক্ত হয়।
12. কোনো demo response বাস্তব ambulance dispatch, government submission বা human contact সম্পন্ন হয়েছে—এমন misleading claim করে না।

---

## 8. Privacy, safety ও consent baseline

এই app pension, identity, health এবং location-related sensitive data নিয়ে কাজ করবে। তাই minimum-data collection, explicit consent, role-based access, encrypted transport, audit trail এবং configurable retention শুরু থেকেই design-এর অংশ হবে। SOS বা ambulance flow-এ location share করার আগে permission ও clear explanation থাকবে; location না দিলে coordinate ছাড়া fallback escalation থাকবে।

Document module-এ Aadhaar, voter বা bank data direct government database-এ লেখা হবে না। Pre-filled PDF বা authorized intake handoff-এর আগে elder বা authorized representative review করবেন। Staff dashboard-এ public search, public complaint board বা unnecessary bulk export থাকবে না। Production-এর আগে privacy policy, consent script, incident handling এবং data deletion process আলাদাভাবে review করতে হবে।

---

## 9. Testing strategy

Testing শুধু UI screenshot-এর মধ্যে সীমাবদ্ধ থাকবে না। প্রতিটি safety flow-এর জন্য unit test, API test, offline/retry test এবং দুই-device integration test থাকবে। Bengali text বড় font-এ, low-literacy user-এর জন্য icon-plus-voice feedback-এ, এবং screen reader/large touch target-এ যাচাই করা হবে।

| Test area | Minimum scenario |
|---|---|
| Functional | Check-in, missed deadline, buddy acknowledge, family escalation |
| Emergency | SOS, ambulance separation, permission denied, no network |
| Reliability | App restart, duplicate tap, worker rerun, delayed sync |
| Authorization | Elder, buddy, family ও staff role-এর cross-access denial |
| Accessibility | Large text, high contrast, 48dp-এর বেশি touch area, Bengali voice/readback |
| Field readiness | Low-end Android, intermittent network, low battery, location disabled |
| Auditability | প্রতিটি alert-এর created, acknowledged, escalated এবং resolved timestamp |

---

## 10. Immediate next step

প্রথম implementation iteration-এ কেবল **Phase 0 + Phase 1 foundation** নেওয়া হবে। অগ্রাধিকার হবে: repository rebrand, branded shell, role/onboarding model, check-in data flow এবং elder–buddy escalation-এর minimal working version। এরপর দুইটি test device-এ flow পরীক্ষা করে ফলাফল নথিভুক্ত করা হবে। এই gate pass না করা পর্যন্ত Phase 2 থেকে Phase 6-এর feature development শুরু করা হবে না।

### প্রথম iteration-এর deliverables

- `Sanket Sneho — সংকেত স্নেহ` branded app shell।
- Updated repository metadata, README এবং roadmap documentation।
- Elder onboarding এবং buddy assignment-এর initial flow।
- “আজ ভালো আছি” daily check-in।
- Configurable deadline ও buddy alert simulation/backend contract।
- Separate SOS এবং ambulance button-এর safe placeholder flow।
- Offline queue এবং sync status-এর initial implementation।
- Two-device test checklist এবং Phase 1 gate report।

---

## References

[1]: `/home/ubuntu/upload/pasted_content.txt` — ব্যবহারকারীর দেওয়া “Pashe Achi — Complete App Structure & Build Roadmap”।  
[2]: `https://github.com/susankarkarmakar-pixel/baba-ma-digital-sathi` — বর্তমান GitHub repository।  
[3]: `/home/ubuntu/baba-ma-digital-sathi/src/App.jsx` — বর্তমান voice-first React UI audit।  
[4]: `/home/ubuntu/baba-ma-digital-sathi/src/services/aiService.js` — বর্তমান simulated voice-query behavior audit।  
[5]: `/home/ubuntu/baba-ma-digital-sathi/package.json` — বর্তমান React/Vite project metadata audit।
