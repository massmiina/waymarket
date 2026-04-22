<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Production E-commerce Rules

## Context
This website is already live in production with active users and sales.

**Goal**:
Improve and maintain the website without breaking existing functionality.

---

## Core Rules

- Never modify critical features without analysis first.
- Preserve backward compatibility.
- Keep changes minimal and safe.
- Prioritize business continuity.

---

## Critical Features

Do not break:
- **Authentication**: login/signup/logout (Clerk integration)
- **Search & Filters**: listing discovery in /recherche
- **Messaging**: conversation and message exchange
- **Checkout process**: Stripe/Stripe-Connect integration
- **Listing Management**: creation, editing, and deletion of ads
- **Transactional emails**: Clerk/Resend notifications

---

## Performance Rules

Any modification must:
- Maintain or improve Core Web Vitals
- Reduce unnecessary API/database calls
- Lazy-load images/scripts when possible
- Avoid blocking rendering

---

## SEO Rules

Never break:
- Existing URLs
- Meta tags (Title, Description, OG)
- Structured data (JSON-LD for products)
- Sitemap / robots.txt
- Canonical tags

---

## Security Rules

Always verify:
- Authentication / authorization (Clerk check)
- Admin/user role permissions (Role check)
- Input validation (Zod schemas)
- XSS / CSRF / SQL Injection prevention (Prisma & Next.js safety)

---

## Analytics Rules

Preserve tracking:
- Google Analytics
- Meta Pixel
- Conversion tracking
- Event tracking

---

## AI Output Format

When suggesting modifications:
1. Explain the issue briefly
2. Assess the risk (**Low / Medium / High**)
3. Provide implementation steps
4. Suggest rollback plan
5. Suggest tests
