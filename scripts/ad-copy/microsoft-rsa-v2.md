# Weather Wizard — Microsoft Ads RSA v2

**Account:** Microsoft Advertising — Weather Wizard Roofing
**Platform:** Microsoft Ads (Bing)
**Dynamic insertion syntax:** `{KeyWord:fallback}` (keyword insertion), `{LOC.City}` (location insertion)
**Last updated:** May 2026

---

## Key differences from Google Ads v2

| Feature | Google Ads | Microsoft Ads |
|---|---|---|
| Location insertion | `{LOCATION:Kent}` | `{LOC.City}` |
| Keyword insertion | `{KEYWORD:fallback}` | `{KeyWord:fallback}` |
| URL tracking param | `?keyword={KEYWORD:roofer}` | `?keyword={KeyWord:roofer}` |
| RSA structure | Identical 15 headlines / 4 descriptions | Identical 15 headlines / 4 descriptions |

**Important on `{LOC.City}`:** Microsoft's `{LOC.City}` inserts the city from the user's detected location. Unlike Google's insertion, it does not fall back to a keyword-based geographic term — if Microsoft cannot determine the user's city, the tag is replaced by nothing (leaving a gap). For this reason, every headline using `{LOC.City}` should read sensibly if the city is blank, or use the static fallback version as a second headline.

**Audience note:** Bing's user base skews older and higher-income than Google — this works in Weather Wizard's favour. Jon's personal answering and fixed-price guarantee resonate strongly with this demographic. Lean into the "no surprises" and "workmanship guarantee" angles in descriptions.

---

## How to use this file

1. Each ad group below maps to one RSA in Microsoft Advertising.
2. Replace `{slug}` in the Final URL with the area slug for each area ad group.
3. The `?keyword={KeyWord:roofer}` param must be preserved — the landing page hero reads it.
4. Callouts are "Action Extensions" in Microsoft Ads — add at ad group level.
5. Sitelinks are "Sitelink Extensions" — same structure as Google but entered in the Microsoft UI.

---

### Ad Group: Kent-wide / Generic Roofing

**Final URL:** `https://weatherwizardroofing.co.uk/?keyword={KeyWord:roofer}`
**Tracking template:** Microsoft auto-appends `{msclkid}` via auto-tagging if enabled. Confirm auto-tagging is on in account settings — this is what feeds the Tally conversion importer. Do not manually add `msclkid` to the Final URL.

---

**Headlines (15)** — character count in brackets after each

1. Kent Roofer — No Call-Out Fee [30]
   - Intent: offer / trust
   - Pin position: position 1 (problem-led A/B variant — see Testing notes)

2. Free Quote in 30 Seconds [25]
   - Intent: result
   - Pin position: position 1 (result-led A/B variant — see Testing notes)

3. Roof Leaking in {LOC.City}? [28]
   - Static fallback reads: "Roof Leaking in ?" — awkward if city is blank. Pair with unpinned static headline covering the same intent (headline 10 below).
   - Intent: problem / location
   - Pin position: unpinned

4. 25 Years Fixing Kent Roofs [27]
   - Intent: authority
   - Pin position: unpinned

5. Written Quote, Fixed Price [27]
   - Intent: offer / trust
   - Pin position: unpinned

6. No Call-Out Fee. Ever. [22]
   - Intent: offer / objection removal
   - Pin position: unpinned

7. Call Jon — Not a Call Centre [30]
   - Intent: trust / differentiation
   - Pin position: unpinned

8. Workmanship Guarantee [21]
   - Intent: trust / risk reversal
   - Pin position: unpinned

9. Fully Insured, Fixed Prices [28]
   - Intent: trust
   - Pin position: unpinned

10. Roof Leaking? Fixed Price. [25]
    - Intent: problem → offer (static fallback for headline 3 when city is blank)
    - Pin position: unpinned

11. Same-Day Callback Guaranteed [29]
    - Intent: urgency / trust
    - Pin position: unpinned

12. 0800 316 2922 — Free to Call [29]
    - Intent: CTA / friction removal
    - Pin position: unpinned

13. Get a Price Before We Start [28]
    - Intent: offer / objection removal
    - Pin position: unpinned

14. No Deposit. No Surprises. [26]
    - Intent: risk reversal
    - Pin position: unpinned

15. Local Roofer, Maidstone, Kent [30]
    - Intent: location / trust
    - Pin position: unpinned

---

**Descriptions (4)** — character count in brackets after each

1. Roof leaking? Jon answers the phone himself. No call-out fee, fixed price in writing. [85]
   - Framework: hook → trust → offer

2. 25 years on Kent roofs. Written quotes, no hidden extras. Same-day callback available. [90]
   - Framework: authority → offer → urgency

3. Call 0800 316 2922. Get a firm price before work starts. Fully insured. No surprises. [89]
   - Framework: CTA → offer → trust

4. No call centre. No call-out fee. No hidden costs. Straight answer, fixed price. [88]
   - Framework: contrast → offer → clarity

---

**Action Extensions / Callouts (6)**

- No Call-Out Fee [16]
- Fixed Written Quote [19]
- Workmanship Guarantee [21]
- Fully Insured [14]
- 25 Years Experience [19]
- Same-Day Callback [18]

---

**Sitelinks (4)**

1. Get a Free Quote
   - Line 1: Fixed price before any work starts
   - Line 2: No call-out fee, no obligation
   - URL: `https://weatherwizardroofing.co.uk/?keyword=free-quote`

2. Roof Repair Services
   - Line 1: Tiles, slate, flat roofs, guttering
   - Line 2: 25 years fixing Kent roofs
   - URL: `https://weatherwizardroofing.co.uk/?keyword=roof-repairs`

3. Areas We Cover
   - Line 1: Maidstone, Dartford, Canterbury
   - Line 2: Most of Kent within 30 minutes
   - URL: `https://weatherwizardroofing.co.uk/?keyword=kent-roofer`

4. About Weather Wizard
   - Line 1: Jon answers the phone personally
   - Line 2: Based in Maidstone since day one
   - URL: `https://weatherwizardroofing.co.uk/?keyword=about`

---
---

### Ad Group: Roof Repairs

**Final URL:** `https://weatherwizardroofing.co.uk/?keyword={KeyWord:roof-repairs}`
**Tracking template:** Same account-level auto-tagging as Kent-wide.

---

**Headlines (15)** — character count in brackets after each

1. Roof Repair in {LOC.City} [25]
   - Static fallback without city: "Roof Repair in " — reads awkwardly. Static headline 15 covers this intent. Max expansion with "Tunbridge Wells": "Roof Repair in Tunbridge Wells" = 29 chars. Safe.
   - Intent: location / relevance
   - Pin position: position 1 (problem-led A/B variant — see Testing notes)

2. Free Quote on Any Roof Repair [30]
   - Intent: offer / result
   - Pin position: position 1 (result-led A/B variant — see Testing notes)

3. Leaking Roof? Call Jon Direct [30]
   - Intent: problem / trust
   - Pin position: unpinned

4. 25 Years Repairing Kent Roofs [30]
   - Intent: authority
   - Pin position: unpinned

5. Roof Repairs — Fixed Price [27]
   - Intent: offer
   - Pin position: unpinned

6. No Call-Out Fee on Repairs [27]
   - Intent: offer / objection removal
   - Pin position: unpinned

7. Written Quote Before We Start [29]
   - Intent: offer / trust
   - Pin position: unpinned

8. Tiles, Slate, Flat Roofs [22]
   - Intent: service breadth
   - Pin position: unpinned

9. Fully Insured Roof Repairs [27]
   - Intent: trust
   - Pin position: unpinned

10. Same-Day Callback Guaranteed [29]
    - Intent: urgency
    - Pin position: unpinned

11. No Hidden Costs on Repairs [27]
    - Intent: risk reversal
    - Pin position: unpinned

12. Get a Price in 30 Seconds [26]
    - Intent: result / CTA
    - Pin position: unpinned

13. Repair Guarantee Included [27]
    - Intent: trust
    - Pin position: unpinned

14. Maidstone Roofer, All of Kent [30]
    - Intent: location
    - Pin position: unpinned

15. Roof Repairs Across Kent [25]
    - Intent: location / category (static fallback for headline 1 when city is blank)
    - Pin position: unpinned

---

**Descriptions (4)** — character count in brackets after each

1. Roof leaking? Get a fixed price before we start. No call-out fee. Jon answers personally. [88]
   - Framework: hook → offer → trust

2. 25 years repairing Kent roofs. Written quote, no hidden extras, workmanship guarantee. [90]
   - Framework: authority → offer → trust

3. Tiles, slates, valleys, guttering. One call gets a firm price. [61]
   - Framework: service specificity → CTA

4. Based in Maidstone, fully insured. Fixed price in writing — the number agreed is final. [89]
   - Framework: trust → offer → certainty

---

**Action Extensions / Callouts (6)**

- No Call-Out Fee [16]
- Fixed Written Quote [19]
- Repair Guarantee [17]
- Fully Insured [14]
- 25 Years Experience [19]
- Same-Day Callback [18]

---

**Sitelinks (4)**

Same four sitelinks as Kent-wide ad group.

---
---

### Ad Group: Per-Area Template

**INSTRUCTIONS FOR USE:**
Duplicate this ad group for each area: Maidstone, Tunbridge Wells, Canterbury, Ashford, Dartford.
- Replace `{slug}` in the Final URL with the area slug.
- `{LOC.City}` auto-inserts the searcher's city. Add area-specific keywords to the ad group.
- If Microsoft cannot detect the city, headlines using `{LOC.City}` will have a gap. The static fallback headlines (5, 14) cover this case.

**Final URL:** `https://weatherwizardroofing.co.uk/{slug}/?keyword={KeyWord:roofer}`
(Example for Maidstone: `https://weatherwizardroofing.co.uk/maidstone/?keyword={KeyWord:roofer}`)
**Tracking template:** Same account-level auto-tagging.

---

**Headlines (15)** — character count in brackets after each

1. Roofer in {LOC.City} [21]
   - Max expansion "Tunbridge Wells": "Roofer in Tunbridge Wells" = 25 chars. Safe.
   - Intent: location / relevance
   - Pin position: position 1 (location-led — see Testing notes)

2. Free Quote in 30 Seconds [25]
   - Intent: result
   - Pin position: position 1 (result-led A/B variant — see Testing notes)

3. Roof Leak in {LOC.City}? [24]
   - Max expansion: "Roof Leak in Tunbridge Wells?" = 29 chars. Safe.
   - Intent: problem / location
   - Pin position: unpinned

4. 25 Years Fixing Local Roofs [27]
   - Intent: authority
   - Pin position: unpinned

5. Local Roofer — Fixed Prices [28]
   - Intent: location / offer (static fallback for headlines 1 and 3 when city is blank)
   - Pin position: unpinned

6. No Call-Out Fee — Ever [21]
   - Intent: offer
   - Pin position: unpinned

7. Written Quote Before We Start [29]
   - Intent: offer / trust
   - Pin position: unpinned

8. Same-Day Callback Available [27]
   - Intent: urgency
   - Pin position: unpinned

9. Fully Insured Roof Repairs [27]
   - Intent: trust
   - Pin position: unpinned

10. Workmanship Guarantee [21]
    - Intent: trust / risk reversal
    - Pin position: unpinned

11. 25 Years' Local Experience [26]
    - Intent: authority
    - Pin position: unpinned

12. No Hidden Costs. Fixed Price. [29]
    - Intent: risk reversal
    - Pin position: unpinned

13. Jon Answers the Phone [21]
    - Intent: trust / differentiation
    - Pin position: unpinned

14. Roof Repairs — No Call-Out Fee [30]
    - Intent: service / offer
    - Pin position: unpinned

15. Get a Quote. No Obligation. [28]
    - Intent: CTA / friction removal
    - Pin position: unpinned

---

**Descriptions (4)** — character count in brackets after each

1. Roof problem in {LOC.City}? Jon answers personally. No call-out fee, fixed price. [82]
   - Max expansion with "Tunbridge Wells": "Roof problem in Tunbridge Wells? Jon answers personally. No call-out fee, fixed price." = 83 chars. Safe.
   - Framework: hook / location → trust → offer

2. 25 years repairing roofs across Kent. Written quote before we start — price won't change. [88]
   - Framework: authority → offer → certainty

3. Local roofer based in Maidstone. Covers all of Kent. Fully insured, no hidden extras. [84]
   - Framework: location → coverage → trust

4. Call 0800 316 2922. Get a firm price in 30 seconds. Workmanship guarantee on every job. [85]
   - Framework: CTA → result → trust

---

**Action Extensions / Callouts (6)**

- No Call-Out Fee [16]
- Fixed Written Quote [19]
- Local to Kent [14]
- Fully Insured [14]
- 25 Years Experience [19]
- Same-Day Callback [18]

---

**Sitelinks (4)**

Same four sitelinks as Kent-wide ad group.

---
---

### Ad Group: Emergency / Same-Day Repairs

**Final URL:** `https://weatherwizardroofing.co.uk/?keyword={KeyWord:emergency-roofer}`
**Tracking template:** Same account-level auto-tagging.

**Note on messaging:** Same-day *callback* is the confirmed promise. Do not claim a guaranteed same-day fix. Emergency searchers need to feel understood immediately — lead with the problem.

---

**Headlines (15)** — character count in brackets after each

1. Roof Leaking Right Now? [22]
   - Intent: problem / urgency
   - Pin position: position 1 (problem-led A/B variant — see Testing notes)

2. Same-Day Callback Guaranteed [29]
   - Intent: result / speed
   - Pin position: position 1 (result-led A/B variant — see Testing notes)

3. Kent Emergency Roofer — No Fee [30]
   - Intent: location / offer / urgency
   - Pin position: unpinned

4. Jon Answers, Not a Call Centre [30]
   - Intent: trust / speed
   - Pin position: unpinned

5. Call Now: 0800 316 2922 [23]
   - Intent: CTA
   - Pin position: unpinned

6. Urgent Leak? Fixed Price Today [30]
   - Intent: problem → offer
   - Pin position: unpinned

7. 25 Years — Emergency Repairs [29]
   - Intent: authority / service
   - Pin position: unpinned

8. No Call-Out Fee — Call Today [28]
   - Intent: offer / CTA
   - Pin position: unpinned

9. Fully Insured Emergency Work [29]
   - Intent: trust
   - Pin position: unpinned

10. Same-Day Response in Kent [26]
    - Intent: speed / location
    - Pin position: unpinned

11. Written Quote on Urgent Jobs [29]
    - Intent: offer / trust
    - Pin position: unpinned

12. Roof Damage After a Storm? [26]
    - Intent: problem / context
    - Pin position: unpinned

13. Stop the Leak — Call Jon Now [28]
    - Intent: CTA / urgency / trust
    - Pin position: unpinned

14. Workmanship Guarantee [21]
    - Intent: trust
    - Pin position: unpinned

15. Emergency Roofer, Maidstone [27]
    - Intent: location / category
    - Pin position: unpinned

---

**Descriptions (4)** — character count in brackets after each

1. Roof leaking right now? Call 0800 316 2922 and get a same-day callback from Jon directly. [87]
   - Framework: hook → CTA → result / trust

2. 25 years on Kent roofs. Fixed price before we start. No call-out fee on emergency jobs. [84]
   - Framework: authority → offer → urgency qualifier

3. Fully insured, written quotes, no hidden extras. Jon answers — not a call centre. [88]
   - Framework: trust → trust → differentiation

4. Storm damage, leaking tiles, guttering — same-day callback, firm price. [71]
   - Framework: problem specificity → result / offer

---

**Action Extensions / Callouts (6)**

- No Call-Out Fee [16]
- Same-Day Callback [18]
- Fixed Written Quote [19]
- Fully Insured [14]
- 25 Years Experience [19]
- Call 0800 316 2922 [18]

---

**Sitelinks (4)**

Same four sitelinks as Kent-wide ad group.

---

## Testing notes — Pinned headline A/B plan

**Objective:** Determine whether problem-led or result-led headlines drive higher CTR and lower CPL on Microsoft. Run for a minimum of 14 days. Microsoft's audience skews desktop-heavy, so CPL data will be meaningful sooner than Google (fewer mobile-only sessions diluting conversion intent).

**How to pin in Microsoft Ads:** In the RSA editor, select the headline and use the pin icon. Pin to position 1 only — leave positions 2 and 3 dynamic so Microsoft's serving algorithm fills them.

**The plan:**

| Ad Group | Pin to position 1 | Rationale |
|---|---|---|
| Kent-wide / Generic | `Kent Roofer — No Call-Out Fee` (problem-led) | Bing users are typically decision-mode searchers — objection removal is the stronger hook |
| Roof Repairs | `Free Quote on Any Roof Repair` (result-led) | Repair searchers want the path to a solution immediately |
| Per-Area (all areas) | `Roofer in {LOC.City}` (location-led) | Location confirmation is the highest-trust signal for local searches on Bing |
| Emergency | `Roof Leaking Right Now?` (problem-led) | Panic intent — the problem headline is the mirror, not the sell |

**What to measure after 14 days:**
- CTR per ad group (Microsoft Ads > Combinations performance report)
- CPL via Microsoft Ads offline conversion import (msclkid attributed through Tally and WhatConverts)
- Cross-platform comparison: if Google shows a clear problem-led winner but Microsoft shows result-led winning, segment the strategy permanently — do not force the same winner onto both platforms

---

## Microsoft Ads — platform-specific setup notes

**1. Location insertion (`{LOC.City}`) coverage**
Microsoft location insertion is less reliable than Google's in rural areas and on Bing's smaller network. Test that it fires correctly in the top 5 areas (Maidstone, Dartford, Tunbridge Wells, Canterbury, Ashford) by using the Ad Preview tool with location overrides.

**2. Auto-tagging for offline conversion tracking**
Go to Account Settings > Tracking > enable "Auto-tag my URLs." This appends `msclkid` to all landing page URLs automatically. The `proxy.ts` middleware on the Weather Wizard site reads `msclkid` and stores it in `ww_ms_js` cookie (90-day TTL). The WhatConverts call tracking integration also reads the `msclkid` cookie to attribute phone call conversions back to Microsoft Ads.

**3. Audience targeting differences**
Microsoft Ads allows LinkedIn profile targeting at no extra CPM cost. For Weather Wizard, targeting by "Job Function: Operations / Facilities" and "Industry: Real Estate, Construction" can be added as observation bid modifiers to capture property managers and landlords searching for roofing contractors — a segment that has longer-term value (repeat jobs, word of mouth). Set as +15% bid modifier initially; adjust based on conversion rate data after 30 days.

**4. Import from Google Ads**
Microsoft Ads' "Import from Google Ads" tool is suitable for initial setup but will import Google's `{LOCATION:Kent}` syntax as-is — it will NOT auto-convert to `{LOC.City}`. After importing, do a find-and-replace in the Microsoft Ads editor: replace `{LOCATION:Kent}` with `{LOC.City}` across all imported headlines.

---

## Character count verification log

All headlines checked against the 30-character limit. Where `{LOC.City}` is used, the maximum realistic expansion (Tunbridge Wells = 15 chars) was tested.

**Kent-wide / Generic — final accepted headlines:**
1. Kent Roofer — No Call-Out Fee [30] ✓
2. Free Quote in 30 Seconds [25] ✓
3. Roof Leaking in {LOC.City}? — static 18 chars; max expansion 28 chars ✓
4. 25 Years Fixing Kent Roofs [27] ✓
5. Written Quote, Fixed Price [27] ✓
6. No Call-Out Fee. Ever. [22] ✓
7. Call Jon — Not a Call Centre [30] ✓
8. Workmanship Guarantee [21] ✓
9. Fully Insured, Fixed Prices [28] ✓
10. Roof Leaking? Fixed Price. [25] ✓ (revised from 31-char draft)
11. Same-Day Callback Guaranteed [29] ✓
12. 0800 316 2922 — Free to Call [29] ✓
13. Get a Price Before We Start [28] ✓
14. No Deposit. No Surprises. [26] ✓
15. Local Roofer, Maidstone, Kent [30] ✓

**Roof Repairs — final accepted headlines:**
1. Roof Repair in {LOC.City} — static 16 chars; max expansion 29 chars ✓
2. Free Quote on Any Roof Repair [30] ✓
3. Leaking Roof? Call Jon Direct [30] ✓
4. 25 Years Repairing Kent Roofs [30] ✓
5. Roof Repairs — Fixed Price [27] ✓
6. No Call-Out Fee on Repairs [27] ✓
7. Written Quote Before We Start [29] ✓
8. Tiles, Slate, Flat Roofs [22] ✓
9. Fully Insured Roof Repairs [27] ✓
10. Same-Day Callback Guaranteed [29] ✓
11. No Hidden Costs on Repairs [27] ✓
12. Get a Price in 30 Seconds [26] ✓
13. Repair Guarantee Included [27] ✓
14. Maidstone Roofer, All of Kent [30] ✓
15. Roof Repairs Across Kent [25] ✓

**Per-Area Template — final accepted headlines:**
1. Roofer in {LOC.City} — static 10 chars; max expansion 25 chars ✓
2. Free Quote in 30 Seconds [25] ✓
3. Roof Leak in {LOC.City}? — static 14 chars; max expansion 29 chars ✓
4. 25 Years Fixing Local Roofs [27] ✓
5. Local Roofer — Fixed Prices [28] ✓
6. No Call-Out Fee — Ever [21] ✓
7. Written Quote Before We Start [29] ✓
8. Same-Day Callback Available [27] ✓
9. Fully Insured Roof Repairs [27] ✓
10. Workmanship Guarantee [21] ✓
11. 25 Years' Local Experience [26] ✓
12. No Hidden Costs. Fixed Price. [29] ✓
13. Jon Answers the Phone [21] ✓
14. Roof Repairs — No Call-Out Fee [30] ✓
15. Get a Quote. No Obligation. [28] ✓

**Emergency — final accepted headlines:**
1. Roof Leaking Right Now? [22] ✓
2. Same-Day Callback Guaranteed [29] ✓
3. Kent Emergency Roofer — No Fee [30] ✓
4. Jon Answers, Not a Call Centre [30] ✓ (actual 30 chars — comma, no trailing period)
5. Call Now: 0800 316 2922 [23] ✓
6. Urgent Leak? Fixed Price Today [30] ✓
7. 25 Years — Emergency Repairs [29] ✓
8. No Call-Out Fee — Call Today [28] ✓
9. Fully Insured Emergency Work [29] ✓
10. Same-Day Response in Kent [26] ✓
11. Written Quote on Urgent Jobs [29] ✓
12. Roof Damage After a Storm? [26] ✓
13. Stop the Leak — Call Jon Now [28] ✓
14. Workmanship Guarantee [21] ✓
15. Emergency Roofer, Maidstone [27] ✓

**Banned words check:** "expert", "fast", "professional", "quality", "trusted" — none used across any ad group.

**Confirmed numbers in use:** "25 years" in ≥2 headlines per ad group. "No call-out fee" in ≥2 headlines per ad group. "Fixed price" in ≥2 headlines per ad group. "30 seconds" in headline 2 (Kent-wide and Per-Area).
