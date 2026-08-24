# Sanket Sneho (সংকেত স্নেহ)
## Complete User Manual

**Version:** Phase 1 • Test mode  
**Audience:** Elder users, family members, assigned buddies, field coordinators, and pilot support staff  
**Last updated:** 24 August 2026

> **স্বাস্থ্য-সংক্রান্ত সীমা:** এই application user-entered wellness record রাখে। এটি medical diagnosis, treatment advice বা emergency dispatch system নয়। কোনো গুরুতর বা নতুন উপসর্গ হলে qualified clinician বা স্থানীয় emergency service-এর সাহায্য নিন।

## 1. Sanket Sneho কী করে

Sanket Sneho একটি Bengali-first elder safety ও wellness companion। এটি প্রথমবারের onboarding, daily safety check-in, buddy escalation, SOS alert, ambulance handoff, routine health logging, emergency contacts, family dashboard, offline local storage এবং daily reminder একসঙ্গে রাখে। বর্তমান সংস্করণটি pilot/test mode-এ চলছে; কিছু action browser-এর ভিতরে simulation হিসেবে কাজ করে।

| প্রধান কাজ | কোথায় পাওয়া যাবে | ফলাফল |
|---|---|---|
| প্রথমবার পরিচয় তৈরি | প্রথমবার app খুললে | Elder profile local device-এ রাখা হয় |
| Daily safety check-in | হোম → “চাপুন: আমি ভালো আছি” | সহায়ককে elder-এর খবর নেওয়া হয়েছে বলে বোঝানো হয় |
| Mood ও vital logging | স্বাস্থ্য tab | Mood, routine, optional vitals ও note record হয় |
| Buddy escalation | কার্যকলাপ tab | Missed check-in-এর test alert, acknowledgement ও family escalation দেখা যায় |
| SOS | হোম → SOS সাহায্য | Buddy ও family recipient-দের immediate alert state তৈরি হয় |
| Ambulance handoff | হোম → অ্যাম্বুলেন্স | আলাদা emergency flow এবং ১০৮ call affordance |
| Family dashboard | পরিবার tab | Safety status, wellness glance, contacts ও report preview |
| Reminder | প্রোফাইল tab | Browser notification বা in-app fallback reminder |

## 2. প্রথমবার ব্যবহার শুরু করা

প্রথমবার app খুললে “আপনার পাশে থাকতে কিছু তথ্য জানাবেন?” screen দেখা যাবে। Elder-এর নাম, ফোন নম্বর এবং গ্রামের নাম লিখুন। Ward number optional; এটি location context দেখানোর জন্য ব্যবহার হয়। তারপর “শুরু করি” চাপুন।

ফোন নম্বর ও নাম সঠিকভাবে লিখুন, কারণ এই তথ্য buddy এবং family contact-এর পরিচয় বুঝতে সাহায্য করে। Onboarding সম্পন্ন হলে app-এর home screen খুলবে এবং profile information browser-এর local storage-এ রাখা হবে।

> **Privacy note:** বর্তমান prototype-এ তথ্য device/browser-এর local storage-এ থাকে। Browser data clear করলে profile ও local records মুছে যেতে পারে। Production deployment-এর জন্য authenticated backend, encryption, consent policy এবং access control যোগ করতে হবে।

## 3. Home screen ব্যবহার

Home screen-এ elder-এর নাম, গ্রাম, ward, assigned buddy এবং বর্তমান safety status দেখা যায়। “আজ ভালো আছি” card-টি প্রতিদিনের সবচেয়ে গুরুত্বপূর্ণ সাধারণ action। নিচে health summary card, SOS, ambulance এবং voice-input card থাকে।

| Home element | কীভাবে ব্যবহার করবেন |
|---|---|
| “আজ ভালো আছি” | একবার চাপলে আজকের safety check-in record হয় |
| “শরীর ও মন” | Health logging screen খুলুন |
| “SOS সাহায্য” | Emergency confirmation খুলুন; ভুল করে না পাঠানোর জন্য confirm প্রয়োজন |
| “অ্যাম্বুলেন্স” | Ambulance flow খুলুন; ১০৮-এ ফোন করার সুযোগ আলাদা থাকে |
| “কথা বলে জানান” | Browser support করলে Bengali speech input test করুন |
| অনলাইন/অফলাইন pill | বর্তমান browser connectivity দেখায় |

## 4. Daily safety check-in

প্রতিদিন সন্ধ্যা ৬টার মধ্যে home screen-এর বড় check-in button চাপুন। Button-এর লেখা “আজকের খোঁজ জানানো হয়েছে” হলে আজকের check-in সম্পন্ন হয়েছে। একই দিনে আবার চাপলে নতুন emergency action তৈরি হয় না; সর্বশেষ সময় record-এ update হয়।

যদি internet না থাকে, check-in local device-এ রাখা হবে এবং sync queue-তে অপেক্ষা করবে। Network ফিরে এলে queued items-এর status synced হবে। Current prototype-এ এটি local simulation; real backend synchronization এখনও যুক্ত হয়নি।

## 5. Routine Health Check-in

স্বাস্থ্য tab-এ তিনটি অংশ আছে। প্রথমে mood বেছে নিন: “ভালো”, “মোটামুটি” অথবা “মন খারাপ”। এরপর routine-care items থেকে ঘুম, খাবার এবং নিয়মিত ওষুধ নেওয়ার status নিজের অভিজ্ঞতা অনুযায়ী mark করুন।

Optional vitals section-এ যন্ত্রে মাপা থাকলে temperature, pulse এবং BP উপরে/নিচে লিখতে পারেন। এগুলি optional; কোনো data না থাকলেও health log save করা যাবে। শেষে ছোট note যোগ করে “আজকের স্বাস্থ্য-খোঁজ রাখুন” চাপুন।

| Field | ব্যবহার |
|---|---|
| Mood | আজকের অনুভূতির user-entered record |
| ঘুম | Routine status, diagnosis নয় |
| খাবার | Routine status, diagnosis নয় |
| ওষুধ | User-এর নিজস্ব adherence note; app ওষুধের নাম বা dose নির্ধারণ করে না |
| Temperature, pulse, BP | Device দিয়ে মাপা থাকলে optional record |
| Note | Elder-এর নিজের ভাষায় ছোট নোট |

History card-এ সাম্প্রতিক পাঁচটি entry দেখা যায়। Report workflow সর্বোচ্চ সাম্প্রতিক ১৪টি locally stored health record-এর plain-text summary তৈরি করে।

## 6. Buddy assignment ও missed check-in escalation

Profile tab-এ “আমার পাশে আছেন” card-এ assigned buddy-এর নাম, ধরন ও ফোন নম্বর থাকে। “বদলান” চাপলে buddy name, phone এবং helper type update করা যায়। Helper type হিসেবে ASHA সহায়ক, Anganwadi কর্মী অথবা স্থানীয় volunteer রাখা যায়।

কার্যকলাপ tab-এ “মিসড check-in দেখুন” test control ব্যবহার করলে buddy alert state তৈরি হবে। এরপর “সহায়ক উত্তর দিয়েছেন” চাপলে alert acknowledged হয়। Buddy response না এলে “পরিবারকে জানান” চাপলে family escalation state দেখা যায়।

> এই controls বর্তমানে pilot simulation। Real SMS, FCM push, voice call বা field-worker notification পাঠানোর জন্য backend notification service ও verified phone identity প্রয়োজন।

## 7. SOS emergency panic button

SOS button চাপলে আগে confirmation screen খুলবে। সেখানে assigned buddy এবং registered family contacts-এর preview দেখা যায়। Confirm করার আগে recipient list এবং location guidance দেখে নিন। “দুজনকেই alert করুন” চাপলে immediate alert state তৈরি হবে।

App browser geolocation permission পেলে location capture করার চেষ্টা করে। Permission না দিলে alert বাতিল হয় না; history-তে `GPS share হয়নি` বা `GPS unavailable` লেখা থাকে। Home status-এ “জরুরি সতর্কবার্তা পাঠানো হয়েছে” এবং Activity tab-এ notification history দেখা যায়।

Real emergency হলে app-এর test mode-এর উপর একা নির্ভর করবেন না। স্থানীয় emergency service, family member, buddy বা ১০৮ ambulance service-এ সরাসরি যোগাযোগ করুন।

## 8. Ambulance flow

Ambulance action SOS থেকে আলাদা। Ambulance button-এ confirmation screen খুলে এবং user-কে alert preparation-এর পরে ১০৮-এ ফোন করার affordance দেখায়। Current version real ambulance dispatch করে না; call link device ও browser support-এর উপর নির্ভর করে।

## 9. Emergency contacts ও family dashboard

পরিবার tab-এ বর্তমান safety status, last check-in, latest mood, health record count এবং recent emergency update দেখা যায়। Emergency contacts section-এ যাঁরা SOS alert পাবেন তাঁদের নাম, relationship, phone এবং call action দেখা যায়।

“যোগ করুন” চাপলে নতুন contact-এর নাম, relationship, phone এবং primary/secondary priority লিখুন। Secondary contact-এর ক্ষেত্রে remove action থাকে। Primary buddy ও family contact accidentally remove না করার জন্য protected থাকে।

Family dashboard-এর তথ্য elder-এর local app state থেকে আসে। Production version-এ family member-এর আলাদা authenticated account, role-based permission, consent audit এবং encrypted API দরকার হবে।

## 10. Health summary report

Family dashboard-এর `Health summary report` card থেকে report preview খুলুন। Preview-তে elder profile, village, buddy, মোট record, mood, routine, user-entered vitals এবং notes দেখা যায়। `.txt download` চাপলে একটি plain-text report download হয়।

Report-টি clinician-এর কাছে context দেওয়ার সহায়ক নথি হিসেবে ব্যবহার করা যেতে পারে, কিন্তু এটি diagnosis বা treatment plan নয়। Report share করার আগে elder-এর consent নিন এবং প্রয়োজনের বেশি personal data share করবেন না।

## 11. Offline-first behavior

Browser offline হলে topbar ও profile screen-এ offline status দেখা যায়। Check-in, health log, contact update এবং emergency alert local state-এ থাকে এবং sync queue-তে অপেক্ষা করে। Network ফিরে এলে queue clear হয়ে `শেষ সিঙ্ক` status দেখানোর চেষ্টা করে।

| পরিস্থিতি | User কী দেখবেন | কী করবেন |
|---|---|---|
| Online, queue empty | “ইন্টারনেট সংযুক্ত” | স্বাভাবিকভাবে ব্যবহার করুন |
| Offline | “অফলাইন” এবং pending count | Record চালিয়ে যান; data phone-এ থাকবে |
| Network ফিরে এসেছে | Sync toast বা synced status | কয়েক মুহূর্ত অপেক্ষা করে profile status দেখুন |
| Browser data cleared | Onboarding আবার দেখা যেতে পারে | Profile ও local data পুনরায় তৈরি করুন |

## 12. Daily reminder

Profile tab-এর `দৈনিক reminder` section থেকে reminder চালু করুন। App browser notification permission চাইতে পারে। Permission granted হলে ৬ PM browser reminder ব্যবহারের চেষ্টা হবে। Permission denied, unavailable অথবা sandbox/browser restriction থাকলে in-app fallback reminder ব্যবহার হবে।

`test` action চাপলে reminder message এখনই দেখায়। `বন্ধ` চাপলে reminder disabled হয়। Reminder browser খোলা না থাকলে সব platform-এ background notification নিশ্চিত করে না; production mobile app-এর জন্য native notification scheduler বা service worker push infrastructure প্রয়োজন হবে।

## 13. Voice input

Home screen-এর microphone button Bengali speech input test করে। Browser speech recognition support না করলে app fallback message দেখায় এবং text form ব্যবহার করতে বলে। Voice transcription-কে sensitive data ধরে ব্যবহার করুন; production version-এ audio retention, consent এবং transcription provider policy নির্ধারণ করতে হবে।

## 14. Privacy ও data safety

বর্তমান prototype-এ localStorage ব্যবহার করা হয়েছে এবং backend authentication নেই। Shared computer বা public browser-এ app ব্যবহার করলে browser data অন্য ব্যক্তি দেখতে পারেন। Sensitive information লিখবেন না, এবং কাজ শেষে shared device-এর browser data পরিষ্কার করার local policy অনুসরণ করুন।

Production-এর আগে minimum controls হিসেবে encrypted transport, authenticated family roles, consent record, audit trail, server-side access control, backup/restore policy, data retention period এবং incident response plan প্রয়োজন।

## 15. Troubleshooting

**Profile screen বারবার দেখা গেলে:** Browser local storage clear হয়েছে বা অন্য browser/device ব্যবহার করছেন। Onboarding পুনরায় সম্পূর্ণ করুন।

**Reminder চালু হচ্ছে না:** Profile থেকে `চালু করুন` চাপুন। Browser notification permission দেখে নিন। Permission না থাকলেও In-app reminder ব্যবহার করা যাবে।

**Health record দেখা যাচ্ছে না:** একই browser/device ব্যবহার করছেন কি না দেখুন। Offline queue থাকলে network ফিরে আসার পর কিছু সময় অপেক্ষা করুন।

**SOS location নেই:** Browser location permission না দিলে alert state তবুও তৈরি হবে; Activity history-তে GPS fallback status থাকবে। Real emergency-তে phone call ব্যবহার করুন।

**Call button কাজ করছে না:** Browser/operating system `tel:` link support না করলে phone number দেখে manual call করুন।

**Voice কাজ করছে না:** Microphone permission ও browser support পরীক্ষা করুন; manual text entry ব্যবহার করুন।

## 16. Pilot limitations

এই সংস্করণটি local prototype/test mode। Real SMS, FCM push, backend sync, multi-user authentication, native background notification, government registry integration, real ambulance dispatch, verified GPS sharing এবং clinical decision support এখনও production scope-এর বাইরে। কোনো user safety decision কেবল prototype status-এর উপর ভিত্তি করে নেবেন না।

## 17. Quick safety checklist

জরুরি অবস্থায় প্রথমে বাস্তব সাহায্য নিন। SOS confirm করার আগে recipient preview দেখুন। Health record-এ কেবল নিজের জানা তথ্য লিখুন। Report share করার আগে consent নিন। Shared device-এ browser local data সুরক্ষিত রাখুন। Reminder বন্ধ হলেও daily check-in-এর জন্য আলাদা routine রাখুন।

## References

[1]: <https://vite.dev/guide/static-deploy> “Vite — Deploying a Static Site”

[2]: <https://vite.dev/guide/build> “Vite — Building for Production”
