Project: Samriddhi Workshop OS for Samriddhi Auto Works.
One-user, one Windows laptop garage app. English only. Offline-first.
Internet only for optional day-end email.

Locked rules:
- GST Tax Invoice is a Settings toggle (ON/OFF).
- User can type any line on a bill; if it is not in stock it is non-stock (labour or outside part).
- Next invoice number is settable in Settings (paper bills may already exist). Increment only on Print.
- Default low-stock qty in Settings; each item may override it.
- On SAVE: deduct stock for stock part lines. On re-save: apply only quantity differences. On delete/cancel of an unprinted bill: return stock. Print does not deduct again.
- Printed bill name is the display name only (Oil Filter), never SKU suffixes (MT, KG, KM).
- Never show purchase price or profit % on the customer print/PDF.
- Printed bills are locked in v1. No multi-device sync, no cloud login, no WhatsApp in v1.

If a request conflicts with these rules, follow these rules and say so.

This conversation belongs to a Grok project. The project's files are mounted at `/workspace/artifacts` — look there for user-provided sources before concluding the workspace has no project files. Files written there persist to the project across conversations.