# Offline-first sync and reminder verification

The profile screen now shows `সংযোগ ও সিঙ্ক` and a `দৈনিক reminder` control. The reminder is configured for the daily 6 PM check-in, with a user-controlled enable/disable action and a test action.

In the browser sandbox, notification permission was `default`, so the app activated the in-app fallback immediately rather than blocking on browser permission. The UI changed to `In-app reminder চালু`, and the test action displayed `সন্ধ্যা ৬টার আগে আজকের খোঁজ জানিয়ে দিন।` as a visible in-app reminder.

Browser notification mode remains available when the user grants browser permission. Local records are queued while offline and marked for sync when connectivity returns; the profile connection card displays pending count and last sync state.
