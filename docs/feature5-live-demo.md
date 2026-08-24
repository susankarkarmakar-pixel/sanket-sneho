# Feature 5 live demo

The live browser opened the Sanket Sneho home screen and then the `স্বাস্থ্য` tab. The screen displayed the non-diagnostic safety notice, mood choices (`ভালো`, `মোটামুটি`, `মন খারাপ`), routine toggles, optional temperature/pulse/BP fields, note field, save action, and recent health history.

The existing browser-local test record was visible as `ভালো`, `ঘুম • খাবার • ওষুধ`, and `36.8°C • pulse 72 • BP 120/80`.

The next live demonstration step is the `পরিবার` dashboard and health summary report preview.

The `পরিবার` dashboard displayed current safety status, today's mood, health record count, the two emergency contacts, call actions, an `Emergency contacts` add action, and a `Health summary report` action. Opening the report showed a plain-text preview containing the elder profile, village, buddy, record count, mood, routine, user-entered vitals, and note. The preview explicitly stated that it is not a diagnosis or treatment advice.

The `.txt download` action was triggered successfully and the browser showed `Health summary report download শুরু হয়েছে।` The report modal then closed cleanly and returned to the family dashboard.

The emergency contact editor opened from the family dashboard. The test fields accepted `পাপিয়া দেবী`, relationship `মেয়ে`, and phone `9000090000`, with `Secondary contact` selected by default.

The contact form submitted successfully. The family dashboard now shows `পাপিয়া দেবী • মেয়ে • 9000090000` with a call action and remove action, and the success toast confirmed the contact was stored.
