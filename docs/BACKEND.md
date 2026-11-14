# Enquiry and staff backend

The code is complete for a Supabase-backed enquiry service and staff portal. It has **not** been connected to a real Supabase project or email account. The public enquiry address is intentionally blank until the owner supplies it, so visitors currently see the telephone contact. Once an address is configured, but before online submission is connected, visitors can prepare an email draft, open it in their own email app and send it themselves. They must attach files in their email app. The website does not send or store that draft; a copyable version is shown if no email app is available. No sample leads, staff accounts or inventory are created.

## Provision the project

1. Create a Supabase project in an appropriate region and install/sign in with the Supabase CLI.
2. From the project folder, run `supabase link --project-ref YOUR_PROJECT_REF`, review the migration, then `supabase db push`.
3. Create staff users through Supabase Auth's administrator interface. Disable public signups for this staff-only authentication service. Never add a public signup form.
4. Assign the first administrator through a trusted SQL session:

```sql
insert into public.staff_roles (user_id, role)
values ('UUID_OF_CREATED_AUTH_USER', 'admin');
```

Roles are `admin`, `editor`, and `viewer`. All may read enquiries, private attachments and administrative content. Administrators and editors may update enquiry status and edit products/content. Only administrators have product/image deletion privileges. Staff cannot edit enquiry personal data or assign their own roles. The UI uses reversible unpublishing for catalogue removal. Role assignment/revocation remains an administrator operation through the trusted database interface.

## Frontend build configuration

Create an ignored `.env.local` with the following **public** values, then rebuild:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
VITE_TURNSTILE_SITE_KEY=YOUR_PUBLIC_TURNSTILE_SITE_KEY
VITE_CONTACT_EMAIL=YOUR_CONFIRMED_ENQUIRY_EMAIL
```

Only these public values belong in the frontend. Supabase service keys, email credentials and Turnstile secrets must never have a `VITE_` prefix or enter a Git commit.

## Server secrets and deployment

Set these in the Supabase project's Edge Function secrets interface (or pass them through a protected CLI environment, never a committed file):

| Secret | Purpose |
| --- | --- |
| `ALLOWED_ORIGINS` | Comma-separated exact origins, for example the chosen verified `havissmetrology.in` origin and the existing Sites address if it should accept submissions. |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server verification secret. Configure allowed hostnames in Turnstile as well. |
| `RATE_LIMIT_SALT` | A long randomly generated server secret used to hash IP addresses for rate limiting. |
| `RESEND_API_KEY` | Resend key for business notifications. |
| `ENQUIRY_FROM_EMAIL` | Sender on a domain verified with Resend, e.g. `Haviss Website <website@haviss.com>`. This example is not a claimed existing mailbox. |
| `ENQUIRY_TO_EMAIL` | Recipient chosen and explicitly supplied by the business. This has no default; leave it unset until the business provides an address. |

Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to its Edge Functions. Deploy both functions: `supabase functions deploy submit-enquiry` and `supabase functions deploy retry-notification`. The `verify_jwt = false` declaration for `submit-enquiry` is intentional: visitors have no account. The handler independently enforces origin restrictions, Turnstile verification, rate limits, validation, upload restrictions and a honeypot. The retry function requires a verified staff JWT, checks that the staff member is an admin or editor, and keeps service credentials server-side. Staff requests use authenticated Supabase clients and database/storage RLS.

The form fails closed if its security configuration is incomplete. The server verifies Turnstile with Cloudflare, including the returned hostname. It caps multipart bodies at 6 MB and attachments at 5 MB, accepts PDF/JPEG/PNG only, checks extensions, declared MIME types and file signatures, and stores attachments in a private bucket under random names. Staff receives short-lived download links. No attachments appear in notification emails. Signature checks are not malware scanning; if your document-handling policy requires scanning, add a scanner and quarantine process before allowing staff downloads.

## Persistence and email behavior

The Edge Function persists an enquiry before attempting its email notification. A repeat with the same random request ID will not create a second row. Delivery state is visible in the dashboard as `pending`, `sent` or `failed`. A pending state means email configuration or the explicitly chosen `ENQUIRY_TO_EMAIL` recipient is absent; no email is sent in that case. A failed state means the provider did not accept the attempt. A saved enquiry is never reported as unsaved because the email provider failed. The dashboard displays a count of non-sent notifications; an editor or administrator may retry one manually after email is configured. There is no automatic retry worker or external failure alert, so staff must monitor the dashboard. Check the provider's delivery log before retrying an old or uncertain delivery: provider idempotency is time-limited. The dashboard is the source of truth for received enquiries.

Form submissions are limited to five per IP hash per hour through an atomic database operation. Configure an additional edge/WAF limit for broad abuse protection. The handler relies on the hosting platform's trusted client-IP forwarding headers; do not place an untrusted proxy in front of the function that permits visitors to control those headers.

## Editable content

The staff portal at `/admin` is excluded from public navigation and search indexing. Access is enforced by Supabase authentication and RLS; hiding the route is not the security boundary. Public content is loaded from these records, falling back to reviewed source content:

- `company`: `phone`, `email`, `registeredOffice`, `works`. Public call and map URLs are derived from these values. Changing the public contact address does not change `ENQUIRY_TO_EMAIL`; update that server secret separately if required.
- `training`: `description`, `topics`.
- `service:<slug>`: `summary`, `overview`, `description` (the latter is a compatibility copy of overview).
- `products`: draft/published catalogue records. No unverified inventory is seeded. Staff uploads are decoded and re-encoded to WebP in the browser before upload; only authorized staff may upload to the product-image bucket.

## Launch verification

After credentials are configured, use an authorized test email and test attachment to verify a real submission, database row, notification delivery and staff access. Confirm the form's success reference, error handling, invalid/oversized files, Turnstile expiry and rate limiting. Test each role, including an authenticated account with no staff role, and confirm unauthenticated clients cannot read enquiries or attachments or write products/content. Check filter dates in Indian time and sign-out behavior. Test product draft/publish/unpublish and all three content editors, then remove test data through an authorized administrator.

Automated local tests cover the pure validation and file-signature boundary. Cloud integration, SQL policies and delivery require this project setup and were not claimed as live-tested.

Establish a retention policy for customer details and uploaded drawings with the business before launch. Enquiry personal data and attachments remain until an administrator removes them. Rate-limit hashes should be periodically pruned with a trusted scheduled database operation such as `delete from public.enquiry_rate_limits where window_start < now() - interval '2 days';`. Configure database backups, staff account recovery, notification monitoring and key rotation with the business.

References: [Supabase Edge Function security](https://supabase.com/docs/guides/functions/auth), [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control), [Cloudflare server-side Turnstile verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
