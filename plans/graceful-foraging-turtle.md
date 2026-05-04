# Weather Wizard Google Ads Conversion Diagnosis & Fix Plan

## Executive Summary

**Problem:** 28 clicks, £289 spent, 0 conversions (0% conversion rate vs 15-20% target)

**Root Causes Identified:**
1. Landing page has no compelling offer or incentive
2. Quote form is buried below the fold (after reviews section)
3. No risk reversal messaging (competitors use "no call-out fee", "no deposit")
4. Search terms include irrelevant DIY and competitor branded queries
5. Conversion tracking may be broken (form → thank-you redirect unclear)

---

## Part 1: Campaign Data Analysis

### Campaign Performance
| Campaign | Clicks | Cost | Conversions | CTR |
|----------|--------|------|-------------|-----|
| Kent Wide | 20 | £200.62 | 0 | 7.8% |
| Top 5 Towns | 8 | £88.77 | 0 | 10.3% |
| **Total** | **28** | **£289.39** | **0** | **8.4%** |

**CTR is actually strong (8.4%)** - people are clicking the ads. The problem is post-click.

### Search Term Quality Issues
Many searches are NOT high-intent buyers:

**DIY/Informational (wrong intent):**
- "how to repair hole in roof felt"
- "fibre glass roof repair kit"
- "bitumen roof repair products"
- "cost of new roof uk"
- "quick fix for leaking garage roof"

**Competitor Branded (wasted spend):**
- "keith russell roofing ashford" (£12.87)
- "richards roofing maidstone"
- "ben's gutters prices"
- "stuart guy east grinstead"

**Out of Service Area:**
- "london roofing services"
- "all type roofing croydon"
- "gutter cleaning redhill"

**Wrong Service:**
- "chimney sweep edenbridge" (sweep ≠ repair)
- "roofing supplies ashford/maidstone"

---

## Part 2: Landing Page Conversion Gaps

### Critical Gap #1: No Compelling Offer
**Current:** "Kent Roof Repairs / I'll Fix It Properly" - generic headline, no incentive

**Competitors offer:**
- Affordable Roofing: "20% Discount Available"
- Aspect: "£10 off when you book online"
- Affordable: "FREE guttering with every new roof"
- GutterPRO: "Fixed price regardless of time"

### Critical Gap #2: Form Buried Below Fold
**Current page flow:**
```
Hero → Trust Signals → Services → Reviews → QUOTE FORM (way down)
```

**Competitor approach (Affordable Roofing):**
```
Hero WITH embedded multi-step form → immediate conversion path
```

### Critical Gap #3: No Risk Reversal
**Missing from Weather Wizard:**
- "No call-out fee"
- "No deposit required"
- "Beat any like-for-like quote"
- "Fixed price guarantee"

### Critical Gap #4: Phone Dominates (6:1 ratio)
Phone CTA appears 6+ times before form appears once:
- Header: Call Now
- Hero: 2 phone CTAs
- Services section: 6 service cards with phone
- Mobile sticky bar: Phone
- CTA section: Phone

**Result:** Users call instead of filling form, OR abandon if they don't want to call.

### Critical Gap #5: No Header "Get Quote" Link
Desktop header only has: Logo | Navigation | "Call Now"
**Missing:** Direct link to quote form

---

## Part 3: Competitor Analysis Summary

### Top Performing Competitor Elements

| Element | Affordable Roofing | GutterPRO | Aspect | Weather Wizard |
|---------|-------------------|-----------|--------|----------------|
| Discount/Offer | 20% off | Fixed pricing | £10 off online | ❌ None |
| Form in Hero | ✅ Multi-step | ✅ Instant quote | ✅ Callback form | ❌ Below fold |
| No Call-Out Fee | ✅ | ✅ | ✅ | ❌ |
| Review Badge | ✅ 5-star visible | ✅ 4.9/29,868 | ✅ 4.1/19,359 | ❌ Not prominent |
| Emergency Response | Same day | - | 1-hour guarantee | ❌ Generic "24/7" |
| Pricing Shown | Quote via form | Instant online | £42.75/half hour | ❌ None |

### Consistently Advertising Competitors (Profitable Campaigns)
These appear across multiple keyword searches:
1. **Affordable Roofing Kent** - best overall landing page
2. **Aspect Building & Property Services** - strongest emergency messaging
3. **GutterPRO** - highest review volume (29,868)

---

## Part 4: Fix Plan

### Phase 1: Quick Wins (Immediate - No Code Changes)

#### 1.1 Add Negative Keywords to Google Ads
Block irrelevant searches immediately:

**DIY/Products:**
- "kit", "products", "materials", "supplies", "diy", "how to", "youtube"

**Competitor Names:**
- "keith russell", "richards roofing", "ben's gutters", "stuart guy", "raven roofing"

**Out of Area:**
- "london", "croydon", "redhill", "nottingham", "bolton"

**Wrong Service:**
- "sweep" (chimney sweep vs repair)

#### 1.2 Verify Conversion Tracking
**Action:** Submit test form and confirm:
- Does Tally form redirect to /thank-you page?
- Does Google Ads conversion fire correctly?
- Check Google Ads > Tools > Conversions for tracking status

### Phase 2: Landing Page Improvements (Code Changes)

#### 2.1 Add Compelling Offer to Hero
Replace generic headline with offer-driven messaging:

```
Before: "Kent Roof Repairs / I'll Fix It Properly"

After: "Free Roof Inspection + Fixed Quote in 24 Hours"
       or
       "No Call-Out Fee | Same Day Response | Free Quote"
```

#### 2.2 Move Quote Form Above the Fold
Current location: After reviews section (requires scroll)
New location: In hero section OR immediately after hero

**Option A:** Embed simplified form in hero (2-3 fields max)
**Option B:** Add "Get Your Free Quote" section immediately after hero badges

#### 2.3 Add Risk Reversal Messaging
Add trust badges/text near CTAs:
- "No call-out fee"
- "Free, no-obligation quote"
- "No deposit required"
- "Fixed price - no hidden costs"

#### 2.4 Add "Get Quote" to Header
Current header: Logo | Nav | Call Now
New header: Logo | Nav | **Get Free Quote** | Call Now

#### 2.5 Make Checkatrade Rating Visually Prominent
Current: Rating exists but not eye-catching in hero
New: Large "10/10 on Checkatrade" badge in hero, immediately visible

### Phase 3: Dedicated PPC Landing Page (Recommended)

Create `/landing/roof-repairs` page optimized purely for PPC:

**Structure:**
1. **Hero with embedded form** (3 fields: Name, Phone, Postcode)
2. **Offer headline:** "Free Quote Within 2 Hours | No Call-Out Fee"
3. **3 trust badges:** Checkatrade 10/10 | 25 Years | Fully Insured
4. **Problem/Solution section** (brief)
5. **Before/After photos** (if available)
6. **Testimonials** (2-3 short ones)
7. **Second CTA section** with form
8. **Footer** (minimal)

**Remove:** Navigation menu (prevents exit), excessive content, services section

### Phase 4: Campaign Structure Improvements

#### 4.1 Tighten Keyword Match Types
Review broad match keywords that may be triggering irrelevant searches.
Consider switching to phrase match or exact match for core keywords.

#### 4.2 Create Service-Specific Ad Groups
Currently mixing roof repairs, gutter cleaning, chimney services.
Split into tighter themed groups with relevant landing pages.

#### 4.3 Add Call Extensions + Call-Only Ads
If phone calls are the primary conversion, add:
- Call extensions with business hours
- Call-only ad variants for mobile

---

## Implementation Priority

| Priority | Task | Impact | Effort |
|----------|------|--------|--------|
| 1 | Add negative keywords | High | Low |
| 2 | Verify conversion tracking | Critical | Low |
| 3 | Add offer to hero headline | High | Low |
| 4 | Move form above fold | High | Medium |
| 5 | Add risk reversal badges | Medium | Low |
| 6 | Add "Get Quote" to header | Medium | Low |
| 7 | Create dedicated PPC landing page | High | High |

---

## Verification Plan

After implementing changes:

1. **Test conversion path manually:**
   - Visit landing page
   - Fill form
   - Confirm redirect to /thank-you
   - Check Google Ads for conversion recording

2. **A/B test headlines:**
   - Run current vs offer-driven headline
   - Track conversion rate per variant

3. **Monitor search terms weekly:**
   - Continue adding negative keywords
   - Track quality score improvements

4. **Target metrics:**
   - Conversion rate: 10%+ (industry benchmark for local services)
   - Cost per lead: £30-50 (half current spend per click)

---

## Files to Modify

1. `weather-wizard-site/components/hero-section.tsx` - Add offer messaging, form placement
2. `weather-wizard-site/components/header.tsx` - Add "Get Quote" button
3. `weather-wizard-site/components/quote-form-section.tsx` - May need to create compact version
4. `weather-wizard-site/app/page.tsx` - Reorder sections, form placement
5. `weather-wizard-site/app/[area]/page.tsx` - Same changes for area pages
6. (New) `weather-wizard-site/app/landing/roof-repairs/page.tsx` - Dedicated PPC page

---

## Summary

The 0% conversion rate is caused by:
1. **Weak offer** - no incentive to act now
2. **Hidden form** - buried below fold, phone dominates
3. **No risk reversal** - competitors reduce friction, we don't
4. **Irrelevant traffic** - DIY, competitor, out-of-area searches

**Immediate actions:**
1. Add negative keywords (today)
2. Verify conversion tracking works (today)
3. Add compelling offer to hero (this week)
4. Move form above fold (this week)

**Expected result:** With these changes, targeting 5-10% conversion rate, bringing cost per lead from £∞ to £50-80 (within £80 target).
