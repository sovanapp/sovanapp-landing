# Sovan — Product Roadmap & Phase 1 Plan

> **Last updated:** 28 Jul 2026  
> **Product:** Sovan — commerce engine for indie artists  
> **Sibling brand:** [Kasetape](https://kasetape.com) — SEA indie culture movement, Sovan's first customer  
> **Internal reference:** `masterplan/` (May 2026 — SEA market analysis, payment strategy, Bandcamp research)  
> **💳 Payment gateway:** Stripe (Malaysia). HitPay was unreachable at time of planning (SSL/DNS failure on all domains).

---

## 0. The Dual-Platform Strategy

```
┌──────────────────────────────────────────────────┐
│                   THE SYSTEM                      │
│                                                   │
│  ┌──────────────┐          ┌──────────────────┐  │
│  │   Kasetape   │────────▶▶│      Sovan       │  │
│  │   (brand)    │  drops   │   (platform)     │  │
│  │              │  run on  │                  │  │
│  │  • Editorial │          │  • Storefronts   │  │
│  │  • Events    │          │  • Payments      │  │
│  │  • Community │          │  • Delivery      │  │
│  │  • Culture   │          │  • Payouts       │  │
│  │              │          │  • Dashboard     │  │
│  └──────────────┘          └──────────────────┘  │
│        ▲                           ▲             │
│        │                           │             │
│   SEA indie fans              Any indie artist   │
│   (cassette buyers)           (self-signup)       │
└──────────────────────────────────────────────────┘
```

| | Kasetape | Sovan |
|---|---|---|
| **Role** | Culture brand / movement | Commerce engine |
| **Audience** | SEA indie music fans | Artists (genre-agnostic, eventually global) |
| **Face** | Dark analog, cassettes, editorial | Neutral, technical, protocol-branded |
| **Money** | Doesn't touch it | 10% flat transaction fee |
| **Drops** | Curated cassette drops | The commerce plumbing underneath |
| **Relationship** | Bandcamp Daily → Bandcamp | The platform that powers it |
| **Code** | `D:\...\Kasetape` — static HTML | `D:\...\Sovan` — React + Supabase |
| **Domain** | kasetape.com | sovan.app |

**Sequencing:** Build Sovan's core commerce plumbing against Kasetape's real drops first. Real transactions surface real problems (payouts, refunds, shipping) faster than designing for hypothetical outside artists. Once Sovan handles Kasetape's volume cleanly, open artist self-signup to the wider market.

---

## 1. Competitive Context

### Bandcamp (the benchmark)
- **Revenue share:** 82% to artist (10-15% platform fee)
- **Total paid:** $1.77B over platform lifetime
- **Model:** Digital + physical (vinyl, CD, cassette, t-shirts), name-your-price, Bandcamp Fridays
- **Weaknesses:** US-centric, PayPal/credit card only, desktop-first, English only, no authenticity verification
- **Key takeaway:** The playbook works. The gap is regional + mobile + trust.

### SoundCloud
- **Model:** Freemium streaming + SoundCloud for Artists (distribution)
- **Strength:** Fan engagement (timed comments, reposts)
- **Weakness:** No ownership — users rent access

### Audiomack
- **Model:** Free ad-supported, unlimited uploads
- **Strength:** Frictionless upload, trending charts
- **Weakness:** No direct sales model

### What Nobody Does (Sovan's Gap)
| Gap | Sovan's Answer |
|---|---|
| SEA-local payment rails | Stripe Malaysia: FPX + cards. Revisit HitPay/Airwallex in Phase 4 for deeper SEA methods (DuitNow QR, TNG). |
| Mobile-first indie marketplace in SEA | Responsive web → PWA → native |
| Physical merch checkout for indie artists in SEA | Cassette drops via Kasetape, artist-ships model |
| Cryptographic provenance (long-term) | Phase 3: signed uploads, verification badges |

---

## 2. Phase 1 — Walking Skeleton MVP

### Goal
**One real Kasetape cassette drop, sold end-to-end through Sovan, with money moving.**

```
Artist uploads ──▶ Kasetape lists it ──▶ Fan buys it ──▶
  Stripe processes payment ──▶ Email receipt + download ──▶
    Artist ships physical item ──▶ Sale appears in dashboard
```

### Scope (Must Have)

#### Artist Side
- [ ] **Sign-up** — email + password (Supabase Auth, no wallet, no crypto keys)
- [ ] **Artist profile** — name, bio, photo, location
- [ ] **Upload tracks** — MP3 + FLAC, album art, metadata (title, genre, description)
- [ ] **Set pricing** — fixed price (MYR), single-track or album
- [ ] **List physical item** — cassette/vinyl/CD with price, artist handles shipping
- [ ] **Dashboard** — see sales, revenue total, order list, mark as shipped

#### Fan Side
- [ ] **Browse** — Kasetape storefront (static page pointing at Sovan product data)
- [ ] **"Buy now"** — single-item checkout per track (no cart; one purchase = one order)
- [ ] **Checkout** — Stripe payment (FPX, card)
- [ ] **Receipt** — email with download link (for digital) + shipping confirmation (for physical)
- [ ] **Download** — purchased digital tracks (MP3 + FLAC options)
- [ ] **No fan account required** — guest checkout with email

#### Platform Side
- [ ] **Supabase database** — artists, tracks, orders
- [ ] **Supabase Storage** — audio files + images
- [ ] **Stripe integration** — create payment, handle webhook (via Supabase Edge Function)
- [ ] **SendGrid** — order confirmation, download links
- [ ] **Admin view** — see all orders, basic reconciliation

### Explicitly Out of Scope (Phase 2+)
- Cryptographic signing of uploads
- Human verification (manual review for first cohort — no KYC)
- Discovery/charts/live feed (no inventory to discover yet)
- Artist self-signup to Sovan directly (Kasetape-curated only)
- Multi-language (English first)
- PWA/service worker
- AA wallets / self-custody
- Name-your-price (fixed price only)
- Streaming previews (direct download after purchase)
- Physical fulfillment automation (artist ships)
- Gift cards, fan collections, following

---

## 3. Technical Architecture

```
┌──────────────────────────────────────────┐
│          Kasetape (static site)           │
│  index.html — fetches product data from   │
│  Sovan Supabase (public anon key reads)   │
└──────────────────┬───────────────────────┘
                   │ reads product listings
┌──────────────────▼───────────────────────┐
│              Sovan (React App)            │
│  • Artist sign-up / dashboard             │
│  • Upload flow (→ Supabase Storage)       │
│  • Product management                     │
│  • Buy now → Stripe checkout              │
│  • Download delivery                      │
│  • Admin dashboard                        │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│            Supabase Backend               │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐  │
│  │  Auth   │ │ Database  │ │  Storage  │  │
│  │ (email) │ │ • artists │ │ • audio   │  │
│  │         │ │ • tracks  │ │ • images  │  │
│  │         │ │ • orders  │ │           │  │
│  └─────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────────────────────────────┐ │
│  │         Edge Functions               │ │
│  │  • stripe-webhook (payment callback) │ │
│  │  • send-receipt (email trigger)      │ │
│  └──────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│          External Services               │
│  Stripe   — payment processing           │
│  SendGrid — transactional email          │
└──────────────────────────────────────────┘
```

### Key Decisions

| Decision | Choice | Why |
|---|---|---|
| **Auth** | Supabase Auth (email only) | No wallets, no crypto keys for v1 |
| **Key management** | Invisible/custodial | Sign server-side later; v1 has no signing at all |
| **Database** | Supabase PostgreSQL | Already running, free tier, RLS |
| **Storage** | Supabase Storage | Audio + images, built-in CDN |
| **Payments** | Stripe (Malaysia) | FPX + cards, MYR settlement. ~3% + RM1 fee. Reliable, well-documented, idempotency built in. HitPay was tested 28 Jul 2026 and all domains (hitpay.com, hitpay.com.my, app.hitpay.com) were unreachable. |
| **Webhooks** | Supabase Edge Functions | GitHub Pages can't handle POST callbacks |
| **Webhook idempotency** | Stripe idempotency keys + `stripe_payment_intent_id` UNIQUE constraint | Stripe guarantees exactly-once processing with idempotency keys; edge function must no-op if already paid |
| **Webhook trust** | Recompute fee/payout from `tracks.price_myr` at webhook time | Never trust `amount_myr` from the client INSERT (policy is `WITH CHECK (true)` for guest checkout). Webhook cross-checks against Stripe's confirmed amount. |
| **Data isolation** | No public SELECT on `orders` table | Kasetape reads only from `tracks`; buyer emails must never leak |
| **Email** | SendGrid (Twilio) | 100/day free tier. Now under Twilio, same product. |
| **File formats** | MP3 + FLAC | Skip WAV for v1 (storage cost, no buyer benefit) |
| **Platform fee** | Flat 10% | Tiered pricing is v2 |
| **Merch fulfillment** | Artist ships | No logistics integration |
| **Geography** | Malaysia only | Matches Stripe MY + Kasetape identity |
| **Mobile** | Responsive CSS | PWA/native later |

---

## 4. Database Schema (Phase 1)

### artists
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | Supabase Auth link |
| name | text | Artist/band name |
| bio | text | |
| photo_url | text | Supabase Storage URL |
| location | text | City/country |
| created_at | timestamptz | |

### tracks
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| artist_id | uuid FK → artists | |
| title | text | |
| genre | text | |
| description | text | |
| cover_art_url | text | Supabase Storage URL |
| audio_mp3_url | text | Supabase Storage URL |
| audio_flac_url | text | Supabase Storage URL (nullable) |
| price_myr | integer | In sen (e.g., 1000 = RM10.00) |
| is_physical | boolean | True for cassettes/vinyl |
| physical_type | text | 'cassette', 'vinyl', 'cd', null |
| is_published | boolean | Default false |
| created_at | timestamptz | |

### orders
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| track_id | uuid FK → tracks | |
| buyer_email | text | Guest checkout |
| amount_myr | integer | In sen |
| status | text | 'pending', 'paid', 'shipped', 'completed', 'refunded' |
| stripe_payment_intent_id | text UNIQUE | Stripe reference (idempotency) |
| platform_fee_myr | integer | 10% of amount, computed at webhook time |
| artist_payout_myr | integer | amount - platform_fee, computed at webhook time |
| shipping_address | text | |
| download_token | text UNIQUE | Token-gated digital delivery |
| download_expires_at | timestamptz | 7 days after purchase |
| payout_settled_at | timestamptz | Set when founder completes bank transfer |
| created_at | timestamptz | |

---

## 5. What's Built vs Needs Building

### ✅ Done
- [x] Sovan landing page (sovan.app)
- [x] Kasetape landing page (kasetape.com — static HTML)
- [x] Waitlist (Supabase, working on live site)
- [x] Supabase project (`gowgkxepodrlyxsobzxk`)
- [x] CI/CD (GitHub Pages deploy)
- [x] `.gitignore`, `.env.example`, `README.md`

### 🔴 Phase 1 To Build
- [ ] **Supabase Auth** — email sign-up for artists
- [ ] **Database migration** — artists, tracks, orders schema
- [ ] **Artist dashboard** — React page: upload, manage products, view sales
- [ ] **Upload flow** — file → Supabase Storage → track record
- [ ] **Kasetape storefront** — fetch public product data from Supabase, display grid
- [ ] **"Buy now" checkout** — single-item → Stripe payment page
- [ ] **Stripe webhook** — Supabase Edge Function: mark order paid, trigger email. Must be idempotent (no-op if `stripe_payment_intent_id` already marked paid).
- [ ] **Email receipts** — SendGrid: order confirmation + download link
- [ ] **Download delivery** — token-gated download page
- [ ] **Admin orders view** — see all orders, mark as shipped

---

## 6. Timeline

| Week | Focus |
|---|---|
| **1-2** | Database schema + Supabase Auth + artist sign-up |
| **3-4** | Upload flow (Storage + track records) + artist dashboard |
| **5-6** | Kasetape storefront integration + "buy now" checkout + Stripe integration |
| **7-8** | Stripe webhook (idempotent) + email receipts + download delivery |
| **9** | Buffer: stabilization, edge cases, RLS audit |
| **10** | Testing with real Kasetape drop, polish, ship |

---

## 7. Open Questions (Answered)

| # | Question | Decision |
|---|---|---|
| 1 | Human verification? | Manual review for first cohort. No KYC/selfie. |
| 2 | Key management? | Invisible/custodial. No wallets in v1. |
| 3 | File formats? | MP3 + FLAC only. Skip WAV. |
| 4 | Platform fee? | Flat 10%. Tiered pricing is v2. |
| 5 | Merch fulfillment? | Artist ships. No logistics integration. |
| 6 | Malaysia only? | Yes — matches Stripe MY + Kasetape. |
| 7 | Mobile strategy? | Responsive CSS first. PWA later. Native even later. |

---

## 8. Phase 2 & Beyond

| Phase | Scope |
|---|---|
| **2** | Artist self-signup to Sovan, streaming previews, discovery feed, PWA, name-your-price, social features, **decouple Kasetape from direct Supabase reads** (add API layer) |
| **3** | Cryptographic signing, human verification badge, on-chain provenance, AA wallet sign-in (opt-in) |
| **4** | SEA expansion: Airwallex or HitPay (if operational) for DuitNow QR/TNG/GrabPay, multi-language, mobile apps, physical fulfillment partners |

---

## 9. Payout Process (Phase 1)

**Phase 1 payout = manual bank transfer, founder-run, weekly.**

Stripe settles funds into Sovan's bank account. Artist payouts are processed manually:

1. Founder reviews paid orders from the past week
2. Computes total `artist_payout_myr` per artist (already stored on each order)
3. Transfers via Malaysian bank transfer (FPX/IBG)
4. Marks orders with `payout_settled_at` timestamp

**Why manual:** For a one-drop walking skeleton with a handful of sales, automated split payments (Stripe Connect, etc.) add integration complexity with no volume to justify it. Revisit in Phase 2 when self-signup artists need self-service payout.

---

## 10. File Upload Limits

| File type | Max size |
|---|---|
| Cover art (JPEG/PNG) | 2 MB |
| MP3 audio | 20 MB |
| FLAC audio | 80 MB |

Enforced client-side before upload + server-side in Supabase Storage bucket policy.

---

## 11. Success Criteria (Phase 1 Ships When…)

- [ ] One Kasetape cassette drop sells N units end-to-end
- [ ] Money lands in Sovan bank account (via Stripe)
- [ ] Artist sees the sale in their dashboard and can mark it shipped
- [ ] Buyer receives email receipt + download link (if digital bonus included)
- [ ] Founder completes first weekly payout run to the artist

---

## 12. Viability Scan (28 Jul 2026)

Services checked live via browser at planning time:

| Service | Status | Free Tier | Notes |
|---|---|---|---|
| Supabase | ✅ Live | $0 — 50K MAU, 500MB DB, 1GB storage | Already in use |
| SendGrid (Twilio) | ✅ Live | 100 emails/day | Merged into Twilio; same product |
| Airwallex | ✅ Live | Pay-per-use | Malaysian site detected; Phase 4 |
| **HitPay** | 🔴 Down | N/A | `hitpay.com` = SSL error; `hitpay.com.my` = DNS not found; `app.hitpay.com` = DNS not found |
| **Stripe MY** | ✅ Selected | Pay-per-use (~3% + RM1) | Replacing HitPay for Phase 1 |

**Decision:** Stripe replaces HitPay for Phase 1. If HitPay comes back online, re-evaluate in Phase 4 for DuitNow QR and e-wallet methods.

---

## 13. Known Risks & Sharp Edges

| Risk | Mitigation |
|---|---|
| **Stripe webhook never arrives** | Founder can manually mark order as paid via Supabase dashboard (escape hatch). No UI needed. |
| **Artist uploads wrong file/cover** | Artist can replace track files after listing. Basic edit flow in dashboard. |
| **Buyer loses download link** | Download token valid 7 days; buyer can re-request via email (manual for Phase 1). |
| **SendGrid 100/day limit** | Fine for early drops; monitor on drop day. Upgrade to paid tier before Phase 2. |
| **Kasetape silently breaks on schema change** | Kasetape reads only from public `tracks` view. Any schema change affecting that table = cross-check Kasetape site. |
| **Single-item checkout limits UX** | Acceptable for Phase 1. Cart is Phase 2. |
| **Manual payout doesn't scale** | By design. Automate when volume justifies it. |
| **Stripe ~3% fee vs HitPay's 0.9%** | Acceptable for walking skeleton. Artist take-home ~87% (after 10% Sovan + ~3% Stripe). Revisit if volume grows. |

---

*This roadmap replaces the previous version (which assumed a standalone Sovan product). The dual-platform Kasetape × Sovan strategy — conceived in a prior session — is now the foundation. Payment gateway switched from HitPay to Stripe on 28 Jul 2026 after viability scan.*