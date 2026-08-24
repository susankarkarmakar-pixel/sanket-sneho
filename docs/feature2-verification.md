# Feature 2 verification

The personalized profile view now shows the assigned buddy name, buddy type, phone number, direct call action, and a visible `বদলান` edit button. The home view also shows the assigned buddy name in the location/status strip and check-in explanation.

Next checks: update the buddy assignment, trigger a missed check-in, acknowledge it, and verify family escalation state.

The buddy editor opened successfully. The test values `সুচিত্রা দাস` and `9876543210` were entered successfully, and the helper type was changed to `Anganwadi কর্মী`.

The updated assignment saved successfully. The profile now shows `সুচিত্রা দাস`, `Anganwadi কর্মী`, and `9876543210`. The activity view also references the new buddy in the test instructions.

Next: trigger the missed check-in state and exercise the buddy acknowledgement and family escalation actions.

The activity test control created a new alert with `সহায়কের উত্তর অপেক্ষায়`, and both acknowledgement and family escalation actions appeared. Triggering `পরিবারকে জানান` changed the alert to `পরিবারকে জানানো হয়েছে` and displayed the configured family contact `রাহুল দেবী (ছেলে)`.
