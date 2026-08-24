# Feature 3 verification

The updated Sanket Sneho home screen shows the SOS panic button separately from the ambulance action. Clicking SOS opens a confirmation modal that explicitly previews both immediate recipients: the assigned buddy `সুচিত্রা দাস` and the family contact `রাহুল দেবী`.

The modal states that both recipients will be alerted immediately. It also explains that GPS will be included if permission is granted, while the alert can still be sent if location is not shared. The available actions are cancel and `দুজনকেই alert করুন`.

Next check: confirm the SOS action and verify the sent status, recipient history, and GPS outcome in the activity view.

The SOS action was confirmed. After the short location lookup window, the modal closed and the home safety status changed to `জরুরি সতর্কবার্তা পাঠানো হয়েছে`. The activity view then showed `SOS alert পাঠানো হয়েছে`, `buddy + পরিবার notified`, and `GPS share হয়নি`, confirming the safe location fallback while retaining the immediate alert result.
