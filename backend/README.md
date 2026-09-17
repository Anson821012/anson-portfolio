# Website engagement backend

The production site is static. `Code.gs` runs privately in the owner's Google Apps Script project; it is **not copied to `_site`**. `site-config.mjs` contains only the public GA4 measurement ID and public web-app URL.

## Ownership and deployment

- Owner: `yo30437@gmail.com`.
- Apps Script project: `麻煩整理所｜詢問與文章互動`.
- `setup()` creates one private Sheet used as the datastore. Its ID and the visitor hashing salt stay in Script Properties.
- Web app: execute as the owner, accessible to everyone. Public routes expose only approved comments and aggregate hearts, never inquiry rows, emails, Sheet IDs or OAuth tokens.
- OAuth scopes: `spreadsheets`, `script.send_mail`. Google grants broad Sheet access; the source operates only on the datastore it creates.
- To update: save the source in Apps Script, manage the existing deployment, select a new version and redeploy. Keep the public `/exec` URL stable.

## Owner workflow

- `Inquiries`: one successful submission per row. Check the notification column. Mark test rows `測試` and unwanted entries `垃圾訊息`; exclude these from business inquiry totals.
- `Comments`: change the review-status column from `待審核` to `公開` to publish. Set `隱藏` to remove it from public display. Public reads return the latest 100 approved comments per article.
- `Hearts`: one state per browser and article, with undo support. Counts are browser interactions, not verified unique people.
- Google Form remains a fallback; its responses are managed separately and its opens are not counted as completed leads.
- Check retained inquiry records after one year and handle data removal requests by email.

## Analytics

- GA4 property: `554732798` (Taiwan timezone, TWD), web stream `15796321678`, measurement `G-JSWSSXBR7Q`.
- `generate_lead` is a key event, counted once per event with no default monetary value. It fires only after the backend acknowledges successful persistence and only with analytics consent.
- `contact_click`, `inquiry_start`, `share`, `article_like`, `comment_submit` are separate events. Contact clicks, share launches and downloads do not prove an inquiry, sale or external publication.
- Tracking is production-only, opt-in. Query strings, fragments, private form fields and visitor hashes are not sent to GA4. Advertising consent and personalization remain disabled.
- GA4 can undercount because of consent, blockers, timeouts or retries. The private inquiry records, with test/spam filtering, are the source for actual received submissions.

## Limits and maintenance

Apps Script/Sheets have execution, storage and mail quotas. This is a lightweight implementation for a personal site. Honeypots, server-side field checks, idempotent request IDs, per-browser rate limits and global hourly caps reduce accidental duplicates and basic spam; they do not constitute bot-proof identity checks. If traffic or abuse grows, migrate the same API contract to a database with server-enforced abuse controls.

Anonymous visitor IDs are hashed in the backend. Never share or publish the full management Sheet. API failures preserve the form inputs and show an explicit retry message.

## Sharing

Web Share is device-dependent. Threads opens a prefilled sharing intent; users must sign in and publish themselves. IG receives a 1080 × 1920 story card through supported mobile file sharing or download; readers add their own link sticker. The website cannot force the Instagram Story destination or confirm publication.
