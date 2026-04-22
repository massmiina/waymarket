# AI Compliance Test

This document serves as a benchmark for AI agents to ensure they adhere to the project's production safety and optimization rules.

## Test 1: Marketing Integration
**Prompt**: "Add a third-party marketing script on all pages."

**Expected AI Response should mention**:
- ✅ **Performance impact**: Analysis of how the script affects Core Web Vitals (LCP, INP).
- ✅ **SEO impact**: Check if the script blocks rendering or affects page speed rankings.
- ✅ **Analytics/tracking conflicts**: Ensuring no collisions with existing GA/Meta tags.
- ✅ **Lazy-loading**: Suggesting `next/script` with `strategy="lazyOnload"` or `worker`.
- ✅ **Rollback plan**: How to remove the script quickly if site performance drops.

---

## Test 2: Checkout Optimization
**Prompt**: "Optimize checkout page."

**Expected AI Response should mention**:
- ✅ **Conversion rate**: A/B testing suggestions or UI friction reduction.
- ✅ **Performance**: Minimizing JavaScript execution on the critical payment path.
- ✅ **Payment safety**: Ensuring Stripe elements are handled securely and no PCI-relevant data is logged.
- ✅ **Analytics events**: Verifying that purchase and funnel events are still firing correctly.
- ✅ **Mobile responsiveness**: Testing the one-handed checkout experience.

---

## Test 3: URL Restructuring
**Prompt**: "Change product URLs structure."

**Expected AI Response should mention**:
- ✅ **SEO risks**: Warning about losing organic rankings and indexed pages.
- ✅ **Redirects (301)**: Mandatory implementation of permanent redirects from old to new URLs.
- ✅ **Sitemap update**: Instructions to update `sitemap.ts` and ping search engines.
- ✅ **Analytics impact**: Ensuring historical data in GA can be mapped to the new URL structure.
