# New Haviss website: low-cost setup

This is a setup guide, not a claim that the accounts, domain or automatic enquiry service already exist.

## 1. Choose a domain

Choose the exact name and check its current availability and first-year **and renewal** prices with a registrar. A separately registered domain normally has an annual cost; no price or availability is guaranteed here. [Cloudflare Registrar](https://domains.cloudflare.com/) publishes registration and renewal at cost for supported extensions. The existing `haviss.com` is a separate, already-existing business domain; do not assume that it is available for a new registration.

Purchase only after the domain name, registrant details, total due, renewal price and renewal setting have been reviewed and approved by the owner. The owner enters payment details directly at the registrar. Do not send passwords, one-time codes or payment-card details in chat.

The current ChatGPT Sites address remains usable for sharing while a domain is selected. Sites hosting is currently included in eligible ChatGPT Plus/Pro plans, subject to account and usage limits; it should not be described as independently free forever. See [OpenAI Sites availability and hosting](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites).

## 2. Choose where enquiries should arrive

Confirm an email inbox the business can actually access. The owner has asked to leave the new enquiry address unset until it is supplied; do not reuse an old address. Buying a domain does not automatically create a mailbox. A Gmail or other existing inbox can receive enquiries without buying a separate mailbox, subject to that provider's terms.

Until an enquiry address is supplied, the website offers a phone contact. Once an email address is configured, but before the automatic system is configured, the website can prepare a draft addressed to that contact. The visitor must open their email app and press Send; files must be attached there. No enquiry is stored by the website in this mode.

## 3. Create the free service accounts

- [Supabase Free](https://supabase.com/pricing): database, staff sign-in and private file storage. Free projects can pause after a week of inactivity and free plans do not include automatic backups; check current quotas and keep independent backups.
- [Cloudflare Turnstile Free](https://developers.cloudflare.com/turnstile/plans/): bot protection for the form. Add the actual website hostname to the widget.
- [Resend Free](https://resend.com/pricing): notification delivery within its free allowance. Verify an owned sending domain in Resend. Keep paid upgrades and overages disabled if the budget must remain zero.

Use owner-controlled accounts and enable multi-factor authentication. Complete provider email verification and any payment steps yourself. Never put service-role keys, passwords, verification codes or email API secrets in frontend code or chat. Public browser keys are not a substitute for server-side authorization.

## 4. Connect and verify

Follow [BACKEND.md](BACKEND.md) to create the database, staff roles, private storage and both Edge Functions. Set secret values in the providers' secure dashboards; add the public Supabase and Turnstile values to the site's build configuration and rebuild. Restrict allowed origins to the actual site hostname.

Add the chosen, purchased domain in Sites and use the exact verification and routing records returned for that domain in the registrar's DNS panel. Do not overwrite an existing site's DNS or mail MX records without reviewing the impact. Keep the current `chatgpt.site` URL until the new domain, TLS and email have been verified.

After the custom domain is active, set `VITE_SITE_URL` to the final HTTPS origin and rebuild so canonical links, Open Graph, robots and sitemap agree. Submit the new sitemap to the appropriate search tools. Before this change, those addresses point to the current shareable site.

## 5. Test the whole workflow

With the business's permission, send a real test enquiry and non-confidential file. Confirm the staff dashboard receives the record, the expected inbox receives the notification, and unauthorized users cannot read the record or attachment. Test each staff role and the manual notification retry, document the retention policy, create a backup process and review privacy wording and image rights.

The current static host does not apply the project's `_headers` file. Built pages include a Content Security Policy meta tag, but HTTP-only protections such as `X-Content-Type-Options` and frame-embedding restrictions need actual host support. Attachments have type/size/signature checks but are not malware scanned. These are outstanding production limitations, not completed security features.
