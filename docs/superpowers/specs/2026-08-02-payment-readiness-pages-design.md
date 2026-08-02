# Payment-readiness website pages

## Goal

Prepare Sampath Kumar's static portfolio for Razorpay review before the client's live payment link exists. The website will clearly describe the paid consulting offer and publish the customer-facing policies Razorpay reviewers and international customers expect to find.

## Approved offer

- Service: one-on-one online consulting session
- Duration: 60 minutes
- Price: USD 350
- Delivery: remote video call, with scheduling details shared after payment
- Current booking page remains the primary conversion path

## Scope

1. Keep the existing Editorial Orchid visual system, shared header, and shared footer.
2. Improve `/schedule/` so the paid offer, delivery method, payment status, and service terms are explicit.
3. Add three public, static policy pages:
   - `/policies/terms/`
   - `/policies/privacy/`
   - `/policies/refunds/`
4. Link the policy pages from the footer of the main site pages.
5. Add a short footer link to the paid consulting offer through `/schedule/`.
6. Do not add a Razorpay URL, API key, secret, checkout script, or backend. Those will be added only after the client completes onboarding and supplies the live Payment Link.

## Content and trust requirements

- State that the service is remote and that no physical shipping applies.
- Use the existing public contact channels (LinkedIn and phone) without inventing an email address.
- Make refunds, rescheduling, cancellations, privacy, and terms easy to find.
- Avoid claims that the payment gateway is already active.
- Use an explicit “payment link will be added after approval” state on the schedule page.

## Technical approach

- Add each policy page as a Vite HTML entry and load the shared identity/components CSS plus a small policy-page stylesheet.
- Reuse the existing accessible header/footer markup and navigation behavior.
- Add contract tests that verify the pages exist, contain the approved offer/policy content, and are linked from the public footer.
- Verify with the full Vitest suite and `npm run build`.

## Out of scope

- Razorpay account creation or KYC
- Purpose-code selection
- Live payment-link creation
- Payment verification, webhooks, invoices, or settlement automation
- Legal or tax advice
