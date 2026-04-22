# Workflow: Change Review

Before implementing any modification, follow this procedure:

## Step 1 — Identify Impact

Check impacted elements:
- **Files**: Which files will be modified or deleted?
- **Components**: Which UI components are affected?
- **APIs**: Are there changes to `/api/*` routes or external services?
- **Database**: Are we modifying `schema.prisma` or running migrations?
- **Business features**: How does this affect search, checkout, or messaging?

---

## Step 2 — Review Risks

Check possible impacts on:
- **Performance**: Bundle size, API latency, Core Web Vitals.
- **SEO**: Meta tags, structured data, URL structure.
- **Security**: Authentication, authorization, input validation.
- **Analytics**: Event tracking, conversion pixels.
- **UX/UI**: Mobile responsiveness, branding consistency.

---

## Step 3 — Risk Level

Assign a risk level to the change:
- **Low Risk**: Visual tweaks, documentation, small bug fixes.
- **Medium Risk**: New non-critical features, minor refactoring.
- **High Risk**: Database migrations, auth changes, checkout/payment modifications.

---

## Step 4 — Rollback Plan

Explain how to revert quickly if needed.
Examples:
- **Git Revert**: Revert the specific commit.
- **Feature Flag**: Disable the feature via environment variables.
- **Database**: Restore a previous snapshot or run a reverse migration.

---

## Step 5 — Testing

Suggest specific tests to run:
- **Functional tests**: Verify the core logic works as expected.
- **Responsive tests**: Check on mobile, tablet, and desktop viewports.
- **Checkout tests**: (If applicable) Test the full payment flow in Stripe sandbox.
- **Tracking tests**: Verify that analytics events are firing correctly.
