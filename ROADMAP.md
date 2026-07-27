# Sovan — Product Roadmap & Phase 1 Plan

> **Last updated:** 28 Jul 2026  
> **Product:** Sovan — commerce engine for indie artists  
> **Sibling brand:** [Kasetape](https://kasetape.com) — SEA indie culture movement, Sovan's first customer  
> **Internal reference:** `masterplan/` (May 2026 — SEA market analysis, payment strategy, Bandcamp research)

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
| SEA-local payment rails | HitPay: DuitNow QR, FPX, TNG, GrabPay |
| Mobile-first indie marketplace in SEA | Responsive web → PWA → native |
| Physical merch checkout for indie artists in SEA | Cassette drops via Kasetape, artist-ships model |
| Cryptographic provenance (long-term) | Phase 3: signed uploads, verification badges |

---

## 2. Phase 1 — Walking Skeleton MVP

### Goal
**One real Kasetape cassette drop, sold end-to-end through Sovan, with money moving.**

```
Artist uploads ──▶ Kasetape lists it ──▶ Fan buys it ──▶
  HitPay processes payment ──▶ Email receipt + download ──▶
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
- [ ] **Checkout** — HitPay payment (DuitNow QR, FPX, card)
- [ ] **Receipt** — email with download link (for digital) + shipping confirmation (for physical)
- [ ] **Download** — purchased digital tracks (MP3 + FLAC options)
- [ ] **No fan account required** — guest checkout with email

#### Platform Side
- [ ] **Supabase database** — artists, tracks, products, orders, downloads
- [ ] **Supabase Storage** — audio files + images
- [ ] **HitPay integration** — create payment, handle webhook (via Supabase Edge Function)
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
│  • Buy now → HitPay checkout               │
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
│  │         │ │ • products│ │           │  │
│  │         │ │ • orders  │ │           │  │
│  └─────────┘ └──────────┘ └───────────┘  │
│  ┌──────────────────────────────────────┐ │
│  │         Edge Functions               │ │
│  │  • hitpay-webhook (payment callback) │ │
│  │  • send-receipt (email trigger)      │ │
│  └──────────────────────────────────────┘ │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────▼───────────────────────┐
│          External Services               │
│  HitPay    — payment processing          │
│  SendGrid  — transactional email         │
└──────────────────────────────────────────┘
```

### Key Decisions

| Decision | Choice | Why |
|---|---|---|
| **Auth** | Supabase Auth (email only) | No wallets, no crypto keys for v1 |
| **Key management** | Invisible/custodial | Sign server-side later; v1 has no signing at all |
| **Database** | Supabase PostgreSQL | Already running, free tier, RLS |
| **Storage** | Supabase Storage | Audio + images, built-in CDN |
| **Payments** | HitPay | 0.9% DuitNow, MYR settlement, RM0 monthly |
| **Webhooks** | Supabase Edge Functions | GitHub Pages can't handle POST callbacks |
| **Webhook idempotency** | `hitpay_payment_id` UNIQUE constraint | HitPay retries on timeout; edge function must no-op if already paid |
| **Webhook trust** | Recompute fee/payout from `tracks.price_myr` | Never trust `amount_myr` from the client INSERT (policy is `WITH CHECK (true)` for guest checkout). Webhook is authoritative — cross-check against HitPay's confirmed amount. |
| **Data isolation** | No public SELECT on `orders` table | Kasetape reads only from `tracks`; buyer emails must never leak |
| **Email** | SendGrid | 100/day free tier |
| **File formats** | MP3 + FLAC | Skip WAV for v1 (storage cost, no buyer benefit) |
| **Platform fee** | Flat 10% | Tiered pricing is v2 |
| **Merch fulfillment** | Artist ships | No logistics integration |
| **Geography** | Malaysia only | Matches HitPay rails + Kasetape identity |
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
| created_at | timestamptz | |

### orders
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| track_id | uuid FK → tracks | |
| buyer_email | text | Guest checkout |
| amount_myr | integer | In sen |
| status | text | 'pending', 'paid', 'shipped', 'completed', 'refunded' |
| hitpay_payment_id | text UNIQUE | HitPay reference (idempotency) |
| platform_fee_myr | integer | 10% of amount, computed at payment time |
| artist_payout_myr | integer | amount - platform_fee, computed at payment time |
| shipping_address | text | |
| download_token | text UNIQUE | Token-gated digital delivery |
| download_expires_at | timestamptz | 7 days after purchase |
| payout_settled_at | timestamptz | Set when founder completes bank transfer |
| created_at | timestamptz | |

---

## 5. What's Built vs Needs Building

### ✅ Done
- [x] Sovan landing page (sovan.app — needs copy update for dual-platform)
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
- [ ] **"Buy now" checkout** — single-item → HitPay payment page
- [ ] **HitPay webhook** — Supabase Edge Function: mark order paid, trigger email. Must be idempotent (no-op if `hitpay_payment_id` already marked paid — HitPay retries on timeout).
- [ ] **Email receipts** — SendGrid: order confirmation + download link
- [ ] **Download delivery** — token-gated download page
- [ ] **Admin orders view** — see all orders, mark as shipped

---

## 6. Timeline

| Week | Focus |
|---|---|
| **1-2** | Database schema + Supabase Auth + artist sign-up |
| **3-4** | Upload flow (Storage + track records) + artist dashboard |
| **5-6** | Kasetape storefront integration + "buy now" checkout + HitPay integration |
| **7-8** | HitPay webhook (idempotent) + email receipts + download delivery |
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
| 6 | Malaysia only? | Yes — matches HitPay + Kasetape. |
| 7 | Mobile strategy? | Responsive CSS first. PWA later. Native even later. |

---

## 8. Phase 2 & Beyond

| Phase | Scope |
|---|---|
| **2** | Artist self-signup to Sovan, streaming previews, discovery feed, PWA, name-your-price, social features, **decouple Kasetape from direct Supabase reads** (add API layer) |
| **3** | Cryptographic signing, human verification badge, on-chain provenance, AA wallet sign-in (opt-in) |
| **4** | SEA expansion (Airwallex, multi-language), mobile apps, physical fulfillment partners |

---

## 9. Payout Process (Phase 1)

**Phase 1 payout = manual bank transfer, founder-run, weekly.**

HitPay settles funds into Sovan's merchant account. Artist payouts are processed manually:

1. Founder reviews paid orders from the past week
2. Computes total `artist_payout_myr` per artist (already stored on each order)
3. Transfers via Malaysian bank transfer (FPX/IBG)
4. Marks orders as payout-settled (manual Supabase update)

**Why manual:** For a one-drop walking skeleton with a handful of sales, automated split payments (HitPay sub-merchant, Stripe Connect, etc.) add integration complexity with no volume to justify it. Revisit in Phase 2 when self-signup artists need self-service payout.

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
- [ ] Money lands in Sovan merchant account (via HitPay)
- [ ] Artist sees the sale in their dashboard and can mark it shipped
- [ ] Buyer receives email receipt + download link (if digital bonus included)
- [ ] Founder completes first weekly payout run to the artist

---

## 12. Known Risks & Sharp Edges

| Risk | Mitigation |
|---|---|
| **HitPay webhook never arrives** | Founder can manually mark order as paid via Supabase dashboard (escape hatch). No UI needed. |
| **Artist uploads wrong file/cover** | Artist can replace track files after listing. Basic edit flow in dashboard. |
| **Buyer loses download link** | Download token valid 7 days; buyer can re-request via email (manual for Phase 1). |
| **SendGrid 100/day limit** | Fine for early drops; monitor on drop day. Upgrade to paid tier before Phase 2. |
| **Kasetape silently breaks on schema change** | Kasetape reads only from public `tracks` view. Any schema change affecting that table = cross-check Kasetape site. |
| **Single-item checkout limits UX** | Acceptable for Phase 1. Cart is Phase 2. |
| **Manual payout doesn't scale** | By design. Automate when volume justifies it. |

---

*This roadmap replaces the previous version (which assumed a standalone Sovan product). The dual-platform Kasetape × Sovan strategy — conceived in a prior session — is now the foundation.*
