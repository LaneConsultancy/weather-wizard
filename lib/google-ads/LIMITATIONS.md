# Google Ads API Limitations

## Current Access Level: Test/Explorer

Your Google Ads developer token is currently in **Test/Explorer** mode. This means certain API features have limited functionality.

### ✅ What Works (Confirmed)

- Listing accessible customer accounts
- Listing campaigns
- Getting campaign details
- Campaign performance reports
- Account overview reports
- Creating campaigns
- Managing campaign status (pause/enable)

### ⚠️ Limitations in Test Mode

#### Keyword Planner API
- **Status**: ❌ Not available
- **Error**: "This method is not allowed for use with explorer access"
- **Affected Functions**:
  - `getKeywordIdeas()` - Cannot fetch keyword suggestions
  - `research-keywords` script will not work

#### Other Potential Limitations
Test accounts typically have:
- Limited to 1 MCC account
- Limited number of API calls per day
- Some advanced features may be restricted

### 🚀 Upgrading to Basic/Standard Access

To unlock full API functionality, you need to upgrade your developer token:

#### Steps to Upgrade:

1. **Go to Google Ads API Center**
   - Visit: https://ads.google.com/aw/apicenter
   - Sign in with your MCC account

2. **Request Basic Access**
   - Fill out the access request form
   - Provide information about your use case:
     - Company: Weather Wizard (or your business name)
     - Purpose: Managing PPC campaigns for roofing business
     - Expected API usage: Campaign management, reporting, keyword research

3. **Wait for Approval**
   - Basic access is usually approved within 24-48 hours
   - You'll receive an email notification

4. **No Code Changes Required**
   - Once approved, all functionality will work automatically
   - The developer token stays the same

#### What You'll Get with Basic Access:

- ✅ Keyword Planner API access
- ✅ Higher API rate limits
- ✅ All reporting features
- ✅ Full campaign creation capabilities
- ✅ Ad group and keyword management

### Alternative: Manual Keyword Research

While waiting for API access approval, you can:

1. **Use Google Ads UI**
   - Go to Tools & Settings → Keyword Planner
   - Manually research keywords
   - Export results as CSV

2. **Use Google Keyword Planner directly**
   - https://ads.google.com/aw/keywordplanner/home
   - Free tool available in your Google Ads account

3. **Third-Party Tools**
   - Ubersuggest
   - SEMrush (if available)
   - Ahrefs
   - Google Trends

### Workaround for Now

You can still use the API for:
- Campaign management
- Performance monitoring
- Automated reporting
- Campaign optimization based on existing data

Just add keywords manually through:
- Google Ads UI
- Direct API calls with specific keyword lists (no discovery)

### Testing the API

The `npm run test-google-ads` script works fine because it only uses:
- Customer listing (allowed in test mode)
- Campaign listing (allowed in test mode)
- Performance metrics (allowed in test mode)

### Next Steps

1. **Apply for Basic Access** at https://ads.google.com/aw/apicenter
2. **Continue using available features**:
   - Campaign creation ✅
   - Campaign management ✅
   - Performance reporting ✅
3. **Manual keyword research** in Google Ads UI for now
4. **Once approved**: All features will work, including `research-keywords` script

## Questions?

If you need help with the upgrade process or have questions about what's available in test mode, check the official documentation:
- [Google Ads API Access Levels](https://developers.google.com/google-ads/api/docs/access-levels)
- [Developer Token Guide](https://developers.google.com/google-ads/api/docs/get-started/dev-token)
